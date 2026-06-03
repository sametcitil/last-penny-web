import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import Event from "@/lib/models/Event";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import Category from "@/lib/models/Category";
import GalleryItem from "@/lib/models/GalleryItem";
import { hashPassword } from "@/lib/auth";

const mockCategories = {
  menu: [
    { name: "Yemekler & Tapas", slug: "yemek", type: "menu" },
    { name: "Kahvaltı & Tatlılar", slug: "kahvalti", type: "menu" },
    { name: "İmza Kokteyller", slug: "kokteyl", type: "menu" },
    { name: "Şaraplar", slug: "saraplar", type: "menu" },
    { name: "Fıçı Biralar", slug: "fici-biralar", type: "menu" },
    { name: "Şişe Biralar", slug: "sise-biralar", type: "menu" },
    { name: "Viski & Sert Alkollüler", slug: "alkoller", type: "menu" },
    { name: "Sıcak & Soğuk İçecekler", slug: "icecekler", type: "menu" },
  ],
  event: [
    { name: "Jazz Geceleri", slug: "jazz", type: "event" },
    { name: "Rock / Alternatif", slug: "rock", type: "event" },
    { name: "Akustik Dinletiler", slug: "acoustic", type: "event" },
    { name: "DJ Setleri", slug: "dj", type: "event" },
    { name: "Söyleşi / Kültür", slug: "talk", type: "event" },
    { name: "Diğer Etkinlikler", slug: "other", type: "event" },
  ],
  product: [
    { name: "Tişörtler", slug: "tshirt", type: "product" },
    { name: "Sweatshirtler", slug: "hoodie", type: "product" },
    { name: "Şapkalar", slug: "cap", type: "product" },
    { name: "Aksesuarlar", slug: "accessory", type: "product" },
  ],
  gallery: [
    { name: "Last Penny Lezzetleri", slug: "lezzet", type: "gallery" },
    { name: "Last Penny'den", slug: "mekan", type: "gallery" },
  ],
};

const mockMenuItems = [
  {
    name: "Patatas Bravas",
    description: "Çıtır patates, acı sos ve aioli ile servis edilir",
    price: 180,
    category: "yemek",
    image: "/mock/patatas.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Nachos Grande",
    description: "Cheddar sos, jalapeño, guacamole ve salsa ile",
    price: 220,
    category: "yemek",
    image: "/mock/nachos.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Bruschetta",
    description: "Domates, fesleğen, sarımsak ve zeytinyağı ile",
    price: 150,
    category: "yemek",
    image: "/mock/bruschetta.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Tavuk Kanatları",
    description: "Buffalo sos ile marine edilmiş çıtır kanatlar",
    price: 200,
    category: "yemek",
    image: "/mock/wings.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Halloumi Salatası",
    description: "Izgara hellim, roka, nar ekşisi ve ceviz ile",
    price: 190,
    category: "yemek",
    image: "/mock/salad.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Sangria",
    description: "Ev yapımı kırmızı şarap, mevsim meyveleri ile",
    price: 160,
    category: "kokteyl",
    image: "/mock/sangria.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Old Fashioned",
    description: "Bourbon, Angostura bitter, şeker, portakal kabuğu",
    price: 250,
    category: "kokteyl",
    image: "/mock/oldfashioned.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Mojito",
    description: "Beyaz rom, nane, lime, soda ve şeker ile",
    price: 200,
    category: "kokteyl",
    image: "/mock/mojito.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Aperol Spritz",
    description: "Aperol, prosecco ve soda ile ferahlatıcı",
    price: 220,
    category: "kokteyl",
    image: "/mock/aperol.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Efes Draft",
    description: "Soğuk, taze çekimli fıçı bira 50cl",
    price: 120,
    category: "icecek",
    image: "/mock/beer.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "IPA Craft Bira",
    description: "Yerel mikro bira fabrikasından IPA",
    price: 160,
    category: "icecek",
    image: "/mock/ipa.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Açık Büfe Kahvaltı",
    description: "Cumartesi-Pazar 10:00-15:00 arası zengin kahvaltı",
    price: 350,
    category: "kahvalti",
    image: "/mock/breakfast.jpg",
    isAvailable: true,
    isFeatured: true,
  },
  {
    name: "Cheesecake",
    description: "New York usulü cheesecake, orman meyveli sos",
    price: 130,
    category: "tatli",
    image: "/mock/cheesecake.jpg",
    isAvailable: true,
    isFeatured: false,
  },
  {
    name: "Brownie",
    description: "Sıcak çikolatalı brownie, vanilyalı dondurma ile",
    price: 140,
    category: "tatli",
    image: "/mock/brownie.jpg",
    isAvailable: true,
    isFeatured: false,
  },
];

const mockEvents = [
  {
    title: "Jazz Night — Ankara Jazz Quartet",
    description:
      "Ankara'nın en iyi jazz müzisyenleri ile unutulmaz bir gece. Klasik jazz standartları ve modern yorumlar.",
    date: "2026-06-05T21:00:00",
    time: "21:00",
    image: "/mock/jazz.jpg",
    images: ["/mock/jazz.jpg", "/stage.jpg", "/interior.jpg"],
    price: 250,
    location: "LP Kavaklıdere Sahne",
    category: "jazz",
    isFeatured: true,
  },
  {
    title: "Ayyuka Live",
    description:
      "Türk alternatif rock sahnesinin sevilen grubu Ayyuka, Last Penny sahnesinde!",
    date: "2026-06-07T22:00:00",
    time: "22:00",
    image: "/mock/rock.jpg",
    images: ["/mock/rock.jpg", "/stage.jpg"],
    price: 300,
    location: "LP Kavaklıdere Sahne",
    category: "rock",
    isFeatured: true,
  },
  {
    title: "Akustik Cuma",
    description:
      "Her Cuma akşamı akustik performanslar. Sakin bir atmosferde müzik keyfi.",
    date: "2026-06-06T20:30:00",
    time: "20:30",
    image: "/mock/acoustic.jpg",
    images: ["/mock/acoustic.jpg"],
    price: 0,
    location: "LP Kavaklıdere Sahne",
    category: "acoustic",
    isFeatured: true,
  },
  {
    title: "DJ Night — Deep House Sessions",
    description:
      "Deep house ve electronic müzik ile dans pistini ısıtıyoruz.",
    date: "2026-06-08T23:00:00",
    time: "23:00",
    image: "/mock/dj.jpg",
    images: ["/mock/dj.jpg", "/bar.jpg"],
    price: 100,
    location: "LP Kavaklıdere Sahne",
    category: "dj",
    isFeatured: false,
  },
  {
    title: "Kitap Kulübü",
    description:
      "Aylık kitap buluşmamız. Bu ay: Sabahattin Ali - Kürk Mantolu Madonna",
    date: "2026-06-10T19:00:00",
    time: "19:00",
    image: "/mock/bookclub.jpg",
    images: ["/mock/bookclub.jpg"],
    price: 0,
    location: "LP Kavaklıdere Kütüphane",
    category: "talk",
    isFeatured: false,
  },
  {
    title: "Stand-Up Comedy Night",
    description:
      "Ankara'nın en komik stand-up'çıları ile kahkaha dolu bir gece.",
    date: "2026-06-12T21:00:00",
    time: "21:00",
    image: "/mock/standup.jpg",
    images: ["/mock/standup.jpg"],
    price: 200,
    location: "LP Kavaklıdere Sahne",
    category: "other",
    isFeatured: false,
  },
];

const mockProducts = [
  {
    name: "Last Penny Classic Tee",
    description: "Siyah pamuklu tişört, ön yüzde Last Penny logosu",
    price: 350,
    category: "tshirt",
    image: "/mock/tshirt1.jpg",
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
  },
  {
    name: "Jazz Night Tee",
    description: "Özel jazz night serisi, limited edition baskı",
    price: 400,
    category: "tshirt",
    image: "/mock/tshirt2.jpg",
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
  },
  {
    name: "Last Penny Hoodie",
    description: "Siyah kapüşonlu sweatshirt, sırt baskılı",
    price: 650,
    category: "hoodie",
    image: "/mock/hoodie.jpg",
    sizes: ["S", "M", "L", "XL"],
    stock: 30,
  },
  {
    name: "Last Penny Şapka",
    description: "Siyah beyzbol şapka, işlemeli logo",
    price: 200,
    category: "cap",
    image: "/mock/cap.jpg",
    sizes: ["Standart"],
    stock: 40,
  },
  {
    name: "Bardak Altlığı Seti",
    description: "4'lü ahşap bardak altlığı seti, lazer baskılı",
    price: 150,
    category: "accessory",
    image: "/mock/coaster.jpg",
    sizes: ["Standart"],
    stock: 60,
  },
  {
    name: "Last Penny Anahtarlık",
    description: "Metal penny coin anahtarlık, antik bakır kaplama",
    price: 100,
    category: "accessory",
    image: "/mock/keychain.jpg",
    sizes: ["Standart"],
    stock: 100,
  },
];

const mockGalleryItems = [
  {
    title: "Akustik Köşe & Caz Kütüphanesi",
    category: "mekan",
    image: "/interior.jpg",
  },
  {
    title: "Gece Yarısı Caz Seansı",
    category: "mekan",
    image: "/stage.jpg",
  },
  {
    title: "Last Penny İmza Kokteylleri",
    category: "lezzet",
    image: "/bar.jpg",
  },
  {
    title: "Kitap Kulübü & Söyleşiler",
    category: "mekan",
    image: "/patio.png",
  },
  {
    title: "Pirinç Plak Çalar & Nostalji",
    category: "mekan",
    image: "/sign.png",
  },
  {
    title: "Dostlarla Hafta Sonu",
    category: "mekan",
    image: "/interior.jpg",
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Mevcut verileri temizle
    await MenuItem.deleteMany({});
    await Event.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await GalleryItem.deleteMany({});

    // Kategorileri ekle
    const categoryDocs = [
      ...mockCategories.menu,
      ...mockCategories.event,
      ...mockCategories.product,
      ...mockCategories.gallery,
    ].map((c) => ({
      name: c.name,
      slug: c.slug,
      type: c.type,
    }));
    await Category.insertMany(categoryDocs);

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
      images: event.images || [event.image],
      price: event.price || 0,
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

    // Galeri öğelerini ekle
    const galleryDocs = mockGalleryItems.map((item) => ({
      title: item.title,
      category: item.category,
      image: item.image,
    }));
    await GalleryItem.insertMany(galleryDocs);

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
        categories: categoryDocs.length,
        menuItems: menuDocs.length,
        events: eventDocs.length,
        products: productDocs.length,
        galleryItems: galleryDocs.length,
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