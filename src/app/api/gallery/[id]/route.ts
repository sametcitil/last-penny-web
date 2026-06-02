import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/lib/models/GalleryItem";
import { getCurrentUser } from "@/lib/auth";
import { mockGalleryItems } from "@/lib/mock-data";

// PATCH /api/gallery/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();

    try {
      await dbConnect();
      const item = await GalleryItem.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
      }

      return NextResponse.json({ item });
    } catch (dbErr: any) {
      console.warn("[PATCH /api/gallery/:id] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const idx = mockGalleryItems.findIndex((item) => item._id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
      }
      mockGalleryItems[idx] = { ...mockGalleryItems[idx], ...body };
      return NextResponse.json({ item: mockGalleryItems[idx], isMock: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/gallery/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    try {
      await dbConnect();
      await GalleryItem.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn("[DELETE /api/gallery/:id] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const idx = mockGalleryItems.findIndex((item) => item._id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
      }
      mockGalleryItems.splice(idx, 1);
      return NextResponse.json({ success: true, isMock: true });
    }
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
