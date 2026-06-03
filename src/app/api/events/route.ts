import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";
import { getCurrentUser } from "@/lib/auth";

// GET all events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  try {
    await dbConnect();

    const filter: Record<string, unknown> = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (featured === "true") {
      filter.isFeatured = true;
    }

    const events = await Event.find(filter).sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (err: any) {
    console.error("[GET /api/events] Database failure:", err);
    return NextResponse.json(
      { error: "Etkinlikler yüklenemedi", details: err?.message },
      { status: 500 }
    );
  }
}

// POST new event (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.image && body.images && body.images.length > 0) {
      body.image = body.images[0];
    }

    await dbConnect();
    const event = await Event.create(body);
    return NextResponse.json({ event }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
