import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';

// GET /api/reservations  — tüm rezervasyonları listele (admin)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const date   = searchParams.get('date');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end   = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const reservations = await Reservation.find(filter).sort({ date: 1, time: 1 });
    return NextResponse.json({ success: true, data: reservations });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST /api/reservations  — yeni rezervasyon oluştur (müşteri formu)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const reservation = await Reservation.create(body);
    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}