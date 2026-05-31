import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getCurrentUser } from '@/lib/auth';

// GET /api/menu  — tüm menü öğelerini getir, kategori & subcategory filtresi destekli
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category    = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;
    if (subcategory)                     filter.subcategory = subcategory;

    const items = await MenuItem.find(filter).sort({ subcategory: 1, name: 1 });
    return NextResponse.json({ items });
  } catch (err) {
    console.error('[GET /api/menu]', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST /api/menu  — yeni menü öğesi ekle (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const item = await MenuItem.create(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}