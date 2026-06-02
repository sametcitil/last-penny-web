import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { mockProducts } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

// GET all products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    await dbConnect();

    const filter: Record<string, unknown> = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    if (products.length === 0) {
      let staticProducts = [...mockProducts];
      if (category && category !== "all") {
        staticProducts = staticProducts.filter((p) => p.category === category);
      }
      return NextResponse.json({ products: staticProducts });
    }

    return NextResponse.json({ products });
  } catch (err: any) {
    console.warn("[GET /api/merch] Database failed, using mock fallback:", err?.message || err);
    let staticProducts = [...mockProducts];
    if (category && category !== "all") {
      staticProducts = staticProducts.filter((p) => p.category === category);
    }
    return NextResponse.json({ products: staticProducts });
  }
}

// POST new product (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    try {
      await dbConnect();
      const product = await Product.create(body);
      return NextResponse.json({ product }, { status: 201 });
    } catch (dbErr: any) {
      console.warn("[POST /api/merch] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const newProduct = {
        _id: `mock-product-${Date.now()}`,
        name: body.name,
        description: body.description || "",
        price: body.price || 0,
        category: body.category || "tshirt",
        sizes: body.sizes || ["Standart"],
        stock: body.stock !== undefined ? body.stock : 0,
        image: body.image || "",
      };
      mockProducts.unshift(newProduct);
      return NextResponse.json({ product: newProduct, isMock: true }, { status: 201 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
