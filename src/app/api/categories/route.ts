import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { getCurrentUser } from "@/lib/auth";

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

const DEFAULT_CATEGORIES = {
  menu: [
    { name: "Yemekler & Tapas", slug: "yemek", type: "menu" },
    { name: "Kahvaltı & Tatlılar", slug: "kahvalti", type: "menu" },
    { name: "İmza Kokteyller", slug: "kokteyl", type: "menu" },
    { name: "Şaraplar", slug: "saraplar", type: "menu" },
    { name: "Fıçı Biralar", slug: "fici-biralar", type: "menu" },
    { name: "Şişe Biralar", slug: "sise-biralar", type: "menu" },
    { name: "Viski & Sert Alkollüler", slug: "alkoller", type: "menu" },
    { name: "Sıcak & Soğuk İçecekler", slug: "icecekler", type: "menu" },
  ],
  event: [
    { name: "Jazz Geceleri", slug: "jazz", type: "event" },
    { name: "Rock / Alternatif", slug: "rock", type: "event" },
    { name: "Akustik Dinletiler", slug: "acoustic", type: "event" },
    { name: "DJ Setleri", slug: "dj", type: "event" },
    { name: "Söyleşi / Kültür", slug: "talk", type: "event" },
    { name: "Diğer Etkinlikler", slug: "other", type: "event" },
  ],
  product: [
    { name: "Tişörtler", slug: "tshirt", type: "product" },
    { name: "Sweatshirtler", slug: "hoodie", type: "product" },
    { name: "Şapkalar", slug: "cap", type: "product" },
    { name: "Aksesuarlar", slug: "accessory", type: "product" },
  ],
  gallery: [
    { name: "Last Penny Lezzetleri", slug: "lezzet", type: "gallery" },
    { name: "Last Penny'den", slug: "mekan", type: "gallery" },
  ],
} as const;

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
      const defaults = DEFAULT_CATEGORIES[type];
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
    console.error("[GET /api/categories] DB failure:", err);
    return NextResponse.json(
      { error: "Kategoriler yüklenemedi", details: err?.message },
      { status: 500 }
    );
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

    await dbConnect();
    
    // Check for duplicate slug
    const existing = await Category.findOne({ slug, type });
    if (existing) {
      return NextResponse.json({ error: "Bu kategori zaten mevcut" }, { status: 400 });
    }

    const category = await Category.create({ name, slug, type });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
