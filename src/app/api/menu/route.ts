import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getCurrentUser } from '@/lib/auth';
import { menuItems } from '@/constants/menuData';

// GET /api/menu  — tüm menü öğelerini getir, kategori & subcategory filtresi destekli
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category    = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  try {
    await dbConnect();

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;
    if (subcategory)                     filter.subcategory = subcategory;

    const items = await MenuItem.find(filter).sort({ subcategory: 1, name: 1 });
    return NextResponse.json({ items });
  } catch (err: any) {
    console.warn('[GET /api/menu] Database connection failed, falling back to static menu data:', err?.message || err);

    // Fallback: Filter static menu data
    let filteredItems = menuItems;
    if (category && category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === category);
    }
    if (subcategory) {
      filteredItems = filteredItems.filter(item => item.subcategory === subcategory);
    }

    // Map to ensure all fields required by client are present, including a unique string _id
    const items = filteredItems.map((item, index) => ({
      _id: `static-${item.category}-${index}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      description: '',
      image: '',
      isAvailable: true,
      isFeatured: false,
      subcategory: '',
      ...item
    }));

    // Sort by subcategory (ascending), then by name (ascending)
    items.sort((a, b) => {
      const subCatA = a.subcategory || '';
      const subCatB = b.subcategory || '';
      if (subCatA !== subCatB) {
        return subCatA.localeCompare(subCatB);
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ items });
  }
}

// POST /api/menu  — yeni menü öğesi ekle (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const body = await req.json();
    try {
      await dbConnect();
      const item = await MenuItem.create(body);
      return NextResponse.json({ item }, { status: 201 });
    } catch (dbErr: any) {
      console.warn('[POST /api/menu] Database failed, using mock fallback:', dbErr?.message || dbErr);
      const newItem = {
        ...body,
        _id: `mock-menu-${Date.now()}`,
        description: body.description || '',
        image: body.image || '',
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : false,
        subcategory: body.subcategory || '',
      };
      menuItems.unshift(newItem);
      return NextResponse.json({ item: newItem, isMock: true }, { status: 201 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}