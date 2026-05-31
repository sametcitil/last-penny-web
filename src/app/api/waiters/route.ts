
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Waiter from '@/models/Waiter';

export async function GET() {
  try {
    await dbConnect();
    const waiters = await Waiter.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: waiters });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const waiter = await Waiter.create(body);
    return NextResponse.json({ success: true, data: waiter }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}