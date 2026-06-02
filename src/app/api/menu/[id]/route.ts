import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getCurrentUser } from '@/lib/auth';
import { menuItems } from '@/constants/menuData';

// PATCH /api/menu/:id  — güncelle (admin)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await req.json();

    try {
      await dbConnect();
      const item = await MenuItem.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
      }
      return NextResponse.json({ item });
    } catch (dbErr: any) {
      console.warn('[PATCH /api/menu/:id] Database failed, using mock fallback:', dbErr?.message || dbErr);
      const idx = menuItems.findIndex((item, index) => {
        const itemId = `static-${item.category}-${index}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        return item._id === id || itemId === id;
      });
      
      if (idx === -1) {
        return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
      }

      // Map back properties
      const updatedItem = {
        ...menuItems[idx],
        ...body,
        _id: menuItems[idx]._id || id,
      };
      menuItems[idx] = updatedItem;
      return NextResponse.json({ item: updatedItem, isMock: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/menu/:id  — sil (admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    try {
      await dbConnect();
      const item = await MenuItem.findByIdAndDelete(id);
      if (!item) {
        return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } catch (dbErr: any) {
      console.warn('[DELETE /api/menu/:id] Database failed, using mock fallback:', dbErr?.message || dbErr);
      const idx = menuItems.findIndex((item, index) => {
        const itemId = `static-${item.category}-${index}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        return item._id === id || itemId === id;
      });

      if (idx === -1) {
        return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
      }

      menuItems.splice(idx, 1);
      return NextResponse.json({ success: true, isMock: true });
    }
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}