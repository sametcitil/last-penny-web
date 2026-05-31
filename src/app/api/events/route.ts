import { NextRequest, NextResponse } from "next/server";
import { mockEvents } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

// GET all events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let events = [...mockEvents];

  if (category && category !== "all") {
    events = events.filter((e) => e.category === category);
  }

  if (featured === "true") {
    events = events.filter((e) => e.isFeatured);
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({ events });
}

// POST new event (admin only)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const body = await req.json();
  const newEvent = {
    _id: `e${Date.now()}`,
    ...body,
    isFeatured: false,
  };

  return NextResponse.json({ event: newEvent }, { status: 201 });
}
