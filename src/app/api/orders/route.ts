import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  let orders = [...mockOrders];

  // Non-admin users see only their own orders
  if (user.role !== "admin") {
    orders = orders.filter((o) => o.userId === user.userId);
  }

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
  }

  const newOrder = {
    _id: `o${Date.now()}`,
    userId: user.userId,
    userName: user.email,
    items: body.items,
    totalPrice: body.totalPrice,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ order: newOrder }, { status: 201 });
}
