import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { mockMenuItems } from "@/lib/mock-data";

// PUT update menu item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const item = mockMenuItems.find((m) => m._id === id);

  if (!item) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  const updated = { ...item, ...body };
  return NextResponse.json({ item: updated });
}

// DELETE menu item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;
  const item = mockMenuItems.find((m) => m._id === id);

  if (!item) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ message: "Ürün silindi" });
}
