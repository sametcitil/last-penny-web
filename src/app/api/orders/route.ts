import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const query: Record<string, unknown> = {};
    if (user.role !== "admin") {
      query.userId = user.userId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("[GET /api/orders] Error:", err);
    return NextResponse.json(
      { error: "Siparişler alınamadı", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.create({
      userId: user.userId,
      userName: user.email,
      items: body.items,
      totalPrice: body.totalPrice,
      status: "pending",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/orders] Error:", err);
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı", details: err?.message },
      { status: 400 }
    );
  }
}
