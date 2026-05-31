import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import Event from "@/lib/models/Event";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { mockMenuItems, mockEvents, mockProducts } from "@/lib/mock-data";

export async function POST() {
  try {
    await dbConnect();

    // Mevcut verileri temizle
    await MenuItem.deleteMany({});
    await Event.deleteMany({});
    await Product.deleteMany({});

    // Menü öğelerini ekle
    const menuDocs = mockMenuItems.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    }));
    await MenuItem.insertMany(menuDocs);

    // Etkinlikleri ekle
    const eventDocs = mockEvents.map((event) => ({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      time: event.time,
      image: event.image,
      category: event.category,
      isFeatured: event.isFeatured,
    }));
    await Event.insertMany(eventDocs);

    // Ürünleri ekle
    const productDocs = mockProducts.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      sizes: product.sizes,
      stock: product.stock,
    }));
    await Product.insertMany(productDocs);

    // Admin kullanıcı oluştur (yoksa)
    const existingAdmin = await User.findOne({ email: "admin@lastpenny.com" });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");
      await User.create({
        name: "LP Admin",
        email: "admin@lastpenny.com",
        password: hashedPassword,
        role: "admin",
      });
    }

    // Demo kullanıcı oluştur (yoksa)
    const existingUser = await User.findOne({ email: "user@lastpenny.com" });
    if (!existingUser) {
      const hashedPassword = await hashPassword("user123");
      await User.create({
        name: "LP User",
        email: "user@lastpenny.com",
        password: hashedPassword,
        role: "user",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Veritabanı başarıyla dolduruldu",
      counts: {
        menuItems: menuDocs.length,
        events: eventDocs.length,
        products: productDocs.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed işlemi başarısız", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Seed endpoint aktif. Veri eklemek için POST isteği gönder: POST /api/seed",
  });
}