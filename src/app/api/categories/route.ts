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
    {
        "name": "Yeni",
        "slug": "yeni",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dcf"
    },
    {
        "name": "Fıçı Bira",
        "slug": "fici-bira",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd0"
    },
    {
        "name": "Şişe Bira",
        "slug": "sise-bira",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd1"
    },
    {
        "name": "Penny Signature",
        "slug": "penny-signature",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd2"
    },
    {
        "name": "Doyuranlar",
        "slug": "doyuranlar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd3"
    },
    {
        "name": "Elle Ye!",
        "slug": "elle-ye",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd4"
    },
    {
        "name": "Salatalar",
        "slug": "salatalar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd5"
    },
    {
        "name": "Tapas",
        "slug": "tapas",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd6"
    },
    {
        "name": "Sürahi",
        "slug": "surahi",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd7"
    },
    {
        "name": "Cin & Tonik/Soda",
        "slug": "cin-tonik-soda",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd8"
    },
    {
        "name": "Viski",
        "slug": "viski",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd9"
    },
    {
        "name": "Konyak",
        "slug": "konyak",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dda"
    },
    {
        "name": "Tost ve Gözleme",
        "slug": "tost-gozleme",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddb"
    },
    {
        "name": "Penny Kahvaltı",
        "slug": "penny-kahvalti",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddc"
    },
    {
        "name": "Kırmızı Şarap",
        "slug": "kirmizi-sarap",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddd"
    },
    {
        "name": "Blush, Rose, Beyaz, Köpüklü Şarap",
        "slug": "blush-rose-beyaz-kopuklu",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dde"
    },
    {
        "name": "Sıcak Şarap, Sangria",
        "slug": "sicak-sarap-sangria",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddf"
    },
    {
        "name": "Snaps & Shots",
        "slug": "snaps-shots",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de0"
    },
    {
        "name": "Sıcak İçecekler",
        "slug": "sicak-icecekler",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de1"
    },
    {
        "name": "Soğuk İçecekler",
        "slug": "soguk-icecekler",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de2"
    },
    {
        "name": "Tatlılar",
        "slug": "tatlilar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de3"
    }
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
