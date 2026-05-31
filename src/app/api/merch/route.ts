import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let products = [...mockProducts];

  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const body = await req.json();
  const newProduct = {
    _id: `p${Date.now()}`,
    ...body,
    stock: body.stock || 0,
  };

  return NextResponse.json({ product: newProduct }, { status: 201 });
}
