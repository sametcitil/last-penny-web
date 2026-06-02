import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/lib/models/Event";
import { mockEvents } from "@/lib/mock-data";
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
    
    // If DB is empty, return static items
    if (events.length === 0) {
      let staticEvents = [...mockEvents];
      if (category && category !== "all") {
        staticEvents = staticEvents.filter((e) => e.category === category);
      }
      if (featured === "true") {
        staticEvents = staticEvents.filter((e) => e.isFeatured);
      }
      staticEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return NextResponse.json({ events: staticEvents });
    }

    return NextResponse.json({ events });
  } catch (err: any) {
    console.warn("[GET /api/events] Database failed, using mock fallback:", err?.message || err);
    let staticEvents = [...mockEvents];
    if (category && category !== "all") {
      staticEvents = staticEvents.filter((e) => e.category === category);
    }
    if (featured === "true") {
      staticEvents = staticEvents.filter((e) => e.isFeatured);
    }
    staticEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return NextResponse.json({ events: staticEvents });
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
    try {
      await dbConnect();
      const event = await Event.create(body);
      return NextResponse.json({ event }, { status: 201 });
    } catch (dbErr: any) {
      console.warn("[POST /api/events] Database failed, using mock fallback:", dbErr?.message || dbErr);
      const newEvent = {
        _id: `mock-event-${Date.now()}`,
        title: body.title,
        description: body.description || "",
        date: body.date || new Date().toISOString(),
        time: body.time || "21:00",
        category: body.category || "jazz",
        isFeatured: body.isFeatured || false,
        image: body.image || "",
      };
      mockEvents.unshift(newEvent);
      return NextResponse.json({ event: newEvent, isMock: true }, { status: 201 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
