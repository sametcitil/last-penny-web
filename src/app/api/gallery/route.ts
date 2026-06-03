import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/lib/models/GalleryItem";
import { getCurrentUser } from "@/lib/auth";

// GET /api/gallery
export async function GET() {
  try {
    await dbConnect();
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("[GET /api/gallery] DB connection failed:", err);
    return NextResponse.json(
      { error: "Galeri öğeleri yüklenemedi", details: err?.message },
      { status: 500 }
    );
  }
}

// POST /api/gallery (Admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    const item = await GalleryItem.create(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
