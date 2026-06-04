import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/events/:id
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
    if (body.images && body.images.length > 0) {
      body.image = body.images[0];
    } else if (body.images) {
      body.image = "";
    }

    await dbConnect();
    const event = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PATCH /api/events/:id
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
    if (body.images && body.images.length > 0) {
      body.image = body.images[0];
    } else if (body.images) {
      body.image = "";
    }

    await dbConnect();
    const event = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/events/:id
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

    await dbConnect();
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Etkinlik silindi" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
