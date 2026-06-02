import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { mockProducts } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/merch/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    try {
      await dbConnect();
      const product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }

      return NextResponse.json({ product });
    } catch (dbErr: any) {
      console.warn("[PUT /api/merch/:id] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const idx = mockProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }
      mockProducts[idx] = { ...mockProducts[idx], ...body };
      return NextResponse.json({ product: mockProducts[idx], isMock: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PATCH /api/merch/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    try {
      await dbConnect();
      const product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }

      return NextResponse.json({ product });
    } catch (dbErr: any) {
      console.warn("[PATCH /api/merch/:id] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const idx = mockProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }
      mockProducts[idx] = { ...mockProducts[idx], ...body };
      return NextResponse.json({ product: mockProducts[idx], isMock: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/merch/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;

    try {
      await dbConnect();
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Ürün silindi" });
    } catch (dbErr: any) {
      console.warn("[DELETE /api/merch/:id] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const idx = mockProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      }
      mockProducts.splice(idx, 1);
      return NextResponse.json({ success: true, isMock: true, message: "Ürün silindi" });
    }
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
