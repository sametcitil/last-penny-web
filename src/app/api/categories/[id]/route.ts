import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { getCurrentUser } from "@/lib/auth";
import { mockCategories } from "@/lib/mock-data";

// DELETE /api/categories/:id (Admin only)
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
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn(`[DELETE /api/categories/:id] DB failure, deleting in mock memory fallback for id ${id}:`, dbErr?.message || dbErr);

      // Search memory fallback
      let deleted = false;
      for (const type of ["menu", "event", "product", "gallery"] as const) {
        const idx = mockCategories[type].findIndex((c) => c._id === id);
        if (idx !== -1) {
          mockCategories[type].splice(idx, 1);
          deleted = true;
          break;
        }
      }

      if (!deleted) {
        return NextResponse.json({ error: "Kategori bulunamadı (Mock)" }, { status: 404 });
      }

      return NextResponse.json({ success: true, isMock: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
