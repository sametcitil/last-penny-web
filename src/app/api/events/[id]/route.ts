import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { mockEvents } from "@/lib/mock-data";

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
  const event = mockEvents.find((e) => e._id === id);

  if (!event) {
    return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ event: { ...event, ...body } });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;
  const event = mockEvents.find((e) => e._id === id);

  if (!event) {
    return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ message: "Etkinlik silindi" });
}
