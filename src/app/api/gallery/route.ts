import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/lib/models/GalleryItem";
import { getCurrentUser } from "@/lib/auth";
import { mockGalleryItems } from "@/lib/mock-data";

// GET /api/gallery
export async function GET() {
  try {
    await dbConnect();
    const dbItems = await GalleryItem.find({}).sort({ createdAt: -1 });
    
    // If DB is empty, seed it with mock items or return mock items directly
    if (dbItems.length === 0) {
      return NextResponse.json({ items: mockGalleryItems });
    }
    
    return NextResponse.json({ items: dbItems });
  } catch (err: any) {
    console.warn("[GET /api/gallery] DB connection failed, using static fallback:", err?.message || err);
    return NextResponse.json({ items: mockGalleryItems });
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

    try {
      await dbConnect();
      const item = await GalleryItem.create(body);
      return NextResponse.json({ item }, { status: 201 });
    } catch (dbErr: any) {
      console.warn("[POST /api/gallery] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const newItem = {
        ...body,
        _id: `mock-gallery-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      mockGalleryItems.unshift(newItem);
      return NextResponse.json({ item: newItem, isMock: true }, { status: 201 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
