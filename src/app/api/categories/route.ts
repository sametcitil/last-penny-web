import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { getCurrentUser } from "@/lib/auth";
import { mockCategories } from "@/lib/mock-data";

// Helper to slugify Turkish text
const slugify = (text: string) => {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I", ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U"
  };
  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// GET /api/categories?type=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "menu" | "event" | "product" | "gallery";

  if (!type || !["menu", "event", "product", "gallery"].includes(type)) {
    return NextResponse.json({ error: "Geçersiz kategori tipi" }, { status: 400 });
  }

  try {
    await dbConnect();
    let dbCategories = await Category.find({ type }).sort({ createdAt: 1 });

    // Seed default categories if empty
    if (dbCategories.length === 0) {
      const defaults = mockCategories[type];
      if (defaults && defaults.length > 0) {
        const docs = defaults.map((c) => ({
          name: c.name,
          slug: c.slug,
          type: c.type,
        }));
        await Category.insertMany(docs);
        dbCategories = await Category.find({ type }).sort({ createdAt: 1 });
      }
    }

    return NextResponse.json({ categories: dbCategories });
  } catch (err: any) {
    console.warn(`[GET /api/categories] DB failure, fallback to mock categories of type ${type}:`, err?.message || err);
    const fallbackList = mockCategories[type] || [];
    return NextResponse.json({ categories: fallbackList });
  }
}

// POST /api/categories (Admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { name, type } = await req.json();

    if (!name || !type || !["menu", "event", "product", "gallery"].includes(type)) {
      return NextResponse.json({ error: "Eksik veya geçersiz parametreler" }, { status: 400 });
    }

    const slug = slugify(name);

    try {
      await dbConnect();
      
      // Check for duplicate slug
      const existing = await Category.findOne({ slug, type });
      if (existing) {
        return NextResponse.json({ error: "Bu kategori zaten mevcut" }, { status: 400 });
      }

      const category = await Category.create({ name, slug, type });
      return NextResponse.json({ category }, { status: 201 });
    } catch (dbErr: any) {
      console.warn("[POST /api/categories] DB failure, fallback to mock categories save:", dbErr?.message || dbErr);
      
      const newMockCat = {
        _id: `mock-category-${Date.now()}`,
        name,
        slug,
        type,
      };

      if (!mockCategories[type as keyof typeof mockCategories]) {
        (mockCategories as any)[type] = [];
      }
      (mockCategories as any)[type].push(newMockCat);

      return NextResponse.json({ category: newMockCat, isMock: true }, { status: 201 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
