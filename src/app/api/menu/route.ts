import { NextRequest, NextResponse } from "next/server";
import { mockMenuItems } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

// GET all menu items
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let items = [...mockMenuItems];

  if (category && category !== "all") {
    items = items.filter((item) => item.category === category);
  }

  return NextResponse.json({ items });
}

// POST new menu item (admin only)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const body = await req.json();
  const newItem = {
    _id: `m${Date.now()}`,
    ...body,
    isAvailable: true,
    isFeatured: false,
  };

  return NextResponse.json({ item: newItem }, { status: 201 });
}
