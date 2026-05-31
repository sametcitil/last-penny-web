import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getCurrentUser } from '@/lib/auth';

// PATCH /api/menu/:id  — güncelle (admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin')
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    await dbConnect();
    const body = await req.json();
    const item = await MenuItem.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

    return NextResponse.json({ item });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/menu/:id  — sil (admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin')
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });

    await dbConnect();
    await MenuItem.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}