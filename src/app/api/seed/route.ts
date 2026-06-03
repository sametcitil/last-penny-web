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
    {
        "name": "Yeni",
        "slug": "yeni",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dcf"
    },
    {
        "name": "Fıçı Bira",
        "slug": "fici-bira",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd0"
    },
    {
        "name": "Şişe Bira",
        "slug": "sise-bira",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd1"
    },
    {
        "name": "Penny Signature",
        "slug": "penny-signature",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd2"
    },
    {
        "name": "Doyuranlar",
        "slug": "doyuranlar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd3"
    },
    {
        "name": "Elle Ye!",
        "slug": "elle-ye",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd4"
    },
    {
        "name": "Salatalar",
        "slug": "salatalar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd5"
    },
    {
        "name": "Tapas",
        "slug": "tapas",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd6"
    },
    {
        "name": "Sürahi",
        "slug": "surahi",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd7"
    },
    {
        "name": "Cin & Tonik/Soda",
        "slug": "cin-tonik-soda",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd8"
    },
    {
        "name": "Viski",
        "slug": "viski",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dd9"
    },
    {
        "name": "Konyak",
        "slug": "konyak",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dda"
    },
    {
        "name": "Tost ve Gözleme",
        "slug": "tost-gozleme",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddb"
    },
    {
        "name": "Penny Kahvaltı",
        "slug": "penny-kahvalti",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddc"
    },
    {
        "name": "Kırmızı Şarap",
        "slug": "kirmizi-sarap",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddd"
    },
    {
        "name": "Blush, Rose, Beyaz, Köpüklü Şarap",
        "slug": "blush-rose-beyaz-kopuklu",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285dde"
    },
    {
        "name": "Sıcak Şarap, Sangria",
        "slug": "sicak-sarap-sangria",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285ddf"
    },
    {
        "name": "Snaps & Shots",
        "slug": "snaps-shots",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de0"
    },
    {
        "name": "Sıcak İçecekler",
        "slug": "sicak-icecekler",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de1"
    },
    {
        "name": "Soğuk İçecekler",
        "slug": "soguk-icecekler",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de2"
    },
    {
        "name": "Tatlılar",
        "slug": "tatlilar",
        "type": "menu",
        "_id": "6a2045b17dbc1c1ec1285de3"
    }
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
    "name": "American Porter Pint",
    "description": "Katmanlı,zengin ve yoğun gövdeli biramıza,5 farklı maltın yanısıra damakta da kahve,çikolata,kakao,koyu karamel ve kızarmış ekmek notaları eşlik ediyor. ABV:%6.0 IBU:33",
    "price": 450,
    "category": "yeni",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285de4"
  },
  {
    "name": "Penny Tavuk Burger",
    "description": "Ev Yapımı Tereyağlı Burger Ekmeğine 150gr. Panelenmiş Tavuk Eti, Göbek Marul, Domates, Acılı Közbiber Püresi, Alman Turşusu, Ballı Hardal Sos ve Patates Bravas ile",
    "price": 480,
    "category": "yeni",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285de5"
  },
  {
    "name": "Falafel",
    "description": "Nohut Falafel, Izgara Zeytinli Domatesli Roka Salatası, Yoğurt ve Tahin Sos ile",
    "price": 380,
    "category": "yeni",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285de6"
  },
  {
    "name": "Efes Pilsen",
    "description": "Bavyera",
    "price": 500,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285de7"
  },
  {
    "name": "Efes Pilsen",
    "description": "Pint",
    "price": 260,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285de8"
  },
  {
    "name": "Efes Pilsen",
    "description": "Half Pint",
    "price": 130,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285de9"
  },
  {
    "name": "Stella Artois",
    "description": "Pint",
    "price": 350,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285dea"
  },
  {
    "name": "Stella Artois",
    "description": "Half Pint",
    "price": 175,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285deb"
  },
  {
    "name": "Beck's",
    "description": "Pint",
    "price": 290,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dec"
  },
  {
    "name": "Beck's",
    "description": "Half Pint",
    "price": 145,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285ded"
  },
  {
    "name": "NeIpa",
    "description": "Pint",
    "price": 440,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dee"
  },
  {
    "name": "American Bud Pint",
    "description": "",
    "price": 350,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285def"
  },
  {
    "name": "American Bud Half Pint",
    "description": "",
    "price": 175,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df0"
  },
  {
    "name": "American Porter Pint",
    "description": "Katmanlı,zengin ve yoğun gövdeli biramıza,5 farklı maltın yanısıra damakta da kahve,çikolata,kakao,koyu karamel ve kızarmış ekmek notaları eşlik ediyor. ABV:%6.0 IBU:33",
    "price": 450,
    "category": "fici-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df1"
  },
  {
    "name": "Stella Artois",
    "description": "44 cl",
    "price": 315,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285df2"
  },
  {
    "name": "American Bud",
    "description": "50cl",
    "price": 315,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df3"
  },
  {
    "name": "Miller",
    "description": "33cl",
    "price": 290,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df4"
  },
  {
    "name": "Miller Lime",
    "description": "33cl",
    "price": 290,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df5"
  },
  {
    "name": "Corona",
    "description": "35,5cl",
    "price": 410,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df6"
  },
  {
    "name": "Duvel",
    "description": "33cl",
    "price": 550,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df7"
  },
  {
    "name": "Hoegaarden",
    "description": "33cl",
    "price": 430,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df8"
  },
  {
    "name": "Erdinger",
    "description": "33cl",
    "price": 430,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285df9"
  },
  {
    "name": "Beck's",
    "description": "33cl",
    "price": 280,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dfa"
  },
  {
    "name": "Belfast",
    "description": "50cl",
    "price": 290,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dfb"
  },
  {
    "name": "Bomonti Filtresiz",
    "description": "50cl",
    "price": 300,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dfc"
  },
  {
    "name": "Efes Pilsen",
    "description": "33cl",
    "price": 220,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dfd"
  },
  {
    "name": "Efes Glutensiz",
    "description": "50cl",
    "price": 350,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dfe"
  },
  {
    "name": "Efes Green",
    "description": "50cl",
    "price": 290,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285dff"
  },
  {
    "name": "Efes Malt",
    "description": "50cl",
    "price": 270,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e00"
  },
  {
    "name": "Gara Guzu Summer IPA",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e01"
  },
  {
    "name": "Gara Guzu Ters Köşe",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e02"
  },
  {
    "name": "Gara Guzu Blonde Ale",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e03"
  },
  {
    "name": "Gara Guzu Red Ale",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e04"
  },
  {
    "name": "Gara Guzu Amber Ale",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e05"
  },
  {
    "name": "Gara Guzu IPA 4C",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e06"
  },
  {
    "name": "Gara Guzu Porter",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e07"
  },
  {
    "name": "Gara Guzu Mayhoş",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e08"
  },
  {
    "name": "Gara Guzu Weiss Bier",
    "description": "33cl",
    "price": 450,
    "category": "sise-bira",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e09"
  },
  {
    "name": "London Refresher",
    "description": "Malfy cin, Salatalık, Fesleğen, Taze sıkılmış limon suyu, ev yapımı şeker şurubu",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e0a"
  },
  {
    "name": "Strawberry Collins",
    "description": "Malfy cin, Çilek, Soda, Nane",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e0b"
  },
  {
    "name": "Berry B. Goode",
    "description": "Wiser's Canadian whiskey, Jameson Black Barrel, Böğürtlen, Limon, Nane, Aquafaba.",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e0c"
  },
  {
    "name": "Chopper",
    "description": "Çilek veya karpuz, Fesleğen, Limon suyu, Absolut votka",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e0d"
  },
  {
    "name": "Southside Sour",
    "description": "Malfy Gin,Taze sıkılmış lime suyu, Aqua faba,Ev yapımı şeker şurubu,Nane",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e0e"
  },
  {
    "name": "Smells Like Tropic Spirit",
    "description": "Olmeca Altos, Malibu, Reyhan, Taze sıkılmış limon suyu, Ev yapımı şeker şurubu,Aquafaba",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e0f"
  },
  {
    "name": "Berry Collins",
    "description": "Absolut raspberry,böğürtlen,nane limon suyu,soda",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e10"
  },
  {
    "name": "Mango to The End of Love",
    "description": "Absolut citron,Beyaz şarap,mango,lime,aquafaba",
    "price": 600,
    "category": "penny-signature",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e11"
  },
  {
    "name": "Kasap Köfte",
    "description": "Acı sos, kahvaltılık patates kızartması, turşu, ızgara biber ve domates ile",
    "price": 550,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e12"
  },
  {
    "name": "Zerdeçallı Tavuk",
    "description": "Zerdeçal ve bal ile marine edilmiş tavuk göğsü, patates püresi ve mevsim salata ile",
    "price": 500,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e13"
  },
  {
    "name": "Fish & Chips",
    "description": "Mezgit, salsa ve tartar sos, roka, lahana turşusu ve patatas bravas ile",
    "price": 600,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e14"
  },
  {
    "name": "Baharatlı Sosis",
    "description": "Burger sos, cheddar, karamelize soğan ve bravas ile",
    "price": 600,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e15"
  },
  {
    "name": "Penny Burger",
    "description": "Ev yapımı burger ekmeğine 150gr burger köftesi, karamelize soğan, burger sos, cheddar sos, domates, göbek marul ve bravas ile",
    "price": 570,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e16"
  },
  {
    "name": "Jameson Burger",
    "description": "Ev yapımı tereyağlı burger ekmeğine, 150 gram katkısız burger köftesi, ızgara füme et, karamelize soğan, viski sos, alman turşusu, domates, göbek marul ve bravas ile",
    "price": 600,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e17"
  },
  {
    "name": "Penny Tavuk Burger",
    "description": "Ev Yapımı Tereyağlı Burger Ekmeğine 150gr. Panelenmiş Tavuk Eti, Göbek Marul, Domates, Acılı Közbiber Püresi, Alman Turşusu, Ballı Hardal Sos ve Patates Bravas ile",
    "price": 480,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e18"
  },
  {
    "name": "Pad thai tavuklu",
    "description": "Rice Stick,pad thai sos,havuç,lahana,taze soğan,iç fıstık,julyen tavuk göğsü",
    "price": 550,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e19"
  },
  {
    "name": "Pad thai karides",
    "description": "Rice Stick,lahana,havuç,taze soğan,jumbo karides,pad thai sos,iç fıstık",
    "price": 600,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1a"
  },
  {
    "name": "Pad thai Sebzeli",
    "description": "Rice stick,pad thai sos,havuç,lahana,iç fıstık,taze soğan,",
    "price": 380,
    "category": "doyuranlar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1b"
  },
  {
    "name": "Dana Etli Burrito",
    "description": "Dana eti, sebze, iceberg, cheddar sos ve bravas ile",
    "price": 550,
    "category": "elle-ye",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1c"
  },
  {
    "name": "Çıtır Tavuk",
    "description": "Panelenmiş tavuk, tartar ve salsa sos ile",
    "price": 440,
    "category": "elle-ye",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1d"
  },
  {
    "name": "Tavuk Sandviç",
    "description": "Izgara tavuk göğüs, karamelize soğan, göbek marul ve bravas ile",
    "price": 500,
    "category": "elle-ye",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1e"
  },
  {
    "name": "Sezar Salata",
    "description": "Tavuk Bonfile, Iceberg, Parmesan, Kruton Ekmek, Sezar Sos ile",
    "price": 390,
    "category": "salatalar",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e1f"
  },
  {
    "name": "Tapas Bar",
    "description": "1- Tabağınızı seçin (Peçetenizi unutmayın 😅 ). 2- Pintxos'larınızı alın. 3- Afiyetle yiyin. 4- Kürdanlarını atmayın. 5- Biz gelip kürdanlarınızı sayalım. (Her kürdan 50₺)",
    "price": 50,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e20"
  },
  {
    "name": "Patatas Bravas Parmesan",
    "description": "",
    "price": 310,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e21"
  },
  {
    "name": "Patates Bravas Cheddar",
    "description": "",
    "price": 310,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e22"
  },
  {
    "name": "Patates Bravas Sloppy",
    "description": "",
    "price": 400,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e23"
  },
  {
    "name": "Patates Bravas Sade",
    "description": "",
    "price": 275,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e24"
  },
  {
    "name": "Junior Bravas Parmesan",
    "description": "",
    "price": 250,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e25"
  },
  {
    "name": "Junior Bravas Cheddar",
    "description": "",
    "price": 250,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e26"
  },
  {
    "name": "Junior Bravas Sloppy",
    "description": "",
    "price": 275,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e27"
  },
  {
    "name": "Junior Bravas Sade",
    "description": "",
    "price": 220,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e28"
  },
  {
    "name": "Falafel",
    "description": "Nohut Falafel, Izgara Zeytinli Domatesli Roka Salatası, Yoğurt ve Tahin Sos ile",
    "price": 380,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e29"
  },
  {
    "name": "Mücver",
    "description": "Roka, parmesan peyniri ve bravas sos ile (Mevsime göre balkabağından yapıyoruz.)",
    "price": 380,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2a"
  },
  {
    "name": "Humus Vegan",
    "description": "Domates, turşu, zeytinyağı ve ev yapımı tortilla chips ile",
    "price": 350,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2b"
  },
  {
    "name": "Humus Roll (isteğe göre vegan)",
    "description": "Tortillaya sarılı humus, turşu, domates. Üzerine füme kaburga ve roka ile",
    "price": 410,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2c"
  },
  {
    "name": "Penny Nachos",
    "description": "Chili Con Carne Eşliğinde Cheddar Peyniri, Sos ve Nachos",
    "price": 410,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2d"
  },
  {
    "name": "Nachos Cheddar",
    "description": "",
    "price": 275,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2e"
  },
  {
    "name": "Nachos Sade",
    "description": "Salsa sos ve tartar sos ile servis ediyoruz",
    "price": 220,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e2f"
  },
  {
    "name": "Peynir Tabağı",
    "description": "Gouda, Edam, Kars Gravyer ve İsli Çerkes Peyniri",
    "price": 600,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e30"
  },
  {
    "name": "Zeytin Tabağı",
    "description": "3 çeşit karışık zeytin",
    "price": 220,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e31"
  },
  {
    "name": "Ekstra Cheddar",
    "description": "",
    "price": 50,
    "category": "tapas",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e32"
  },
  {
    "name": "Sangria",
    "description": "",
    "price": 1400,
    "category": "surahi",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e33"
  },
  {
    "name": "London Refresher",
    "description": "",
    "price": 2150,
    "category": "surahi",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e34"
  },
  {
    "name": "Hendrick's Gin&Tonic",
    "description": "",
    "price": 700,
    "category": "cin-tonik-soda",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e35"
  },
  {
    "name": "Malfy Gin & Tonic",
    "description": "",
    "price": 500,
    "category": "cin-tonik-soda",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e36"
  },
  {
    "name": "Aberlour 12yo",
    "description": "Speyside Single Malt Scotch",
    "price": 630,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e37"
  },
  {
    "name": "Aberlour 14yo",
    "description": "Speyside Single Malt Scotch",
    "price": 820,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e38"
  },
  {
    "name": "Aberlour 18yo",
    "description": "Speyside Single Malt Scotch",
    "price": 1650,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e39"
  },
  {
    "name": "Chivas 15yo",
    "description": "Blended Scotch",
    "price": 600,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3a"
  },
  {
    "name": "Chivas 12yo",
    "description": "Blended Scotch",
    "price": 375,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3b"
  },
  {
    "name": "Chivas 18yo",
    "description": "Blended Scotch",
    "price": 800,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3c"
  },
  {
    "name": "Chivas Extra Sherry",
    "description": "",
    "price": 440,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3d"
  },
  {
    "name": "Chivas Extra Smoky",
    "description": "Blended Scotch",
    "price": 440,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3e"
  },
  {
    "name": "The Glenlivet 15",
    "description": "Single Malt Scotch",
    "price": 880,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e3f"
  },
  {
    "name": "The Glenlivet 12",
    "description": "Single Malt Scotch",
    "price": 550,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e40"
  },
  {
    "name": "The Glenlivet 18",
    "description": "Single Malt Scotch",
    "price": 1100,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e41"
  },
  {
    "name": "Jameson IPA Edition",
    "description": "Irish",
    "price": 330,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e42"
  },
  {
    "name": "Jameson Stout Edition",
    "description": "Irish",
    "price": 330,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e43"
  },
  {
    "name": "Jameson Black Barrel",
    "description": "Irish",
    "price": 400,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e44"
  },
  {
    "name": "Jameson",
    "description": "Irish",
    "price": 330,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e45"
  },
  {
    "name": "Macallan 12",
    "description": "Highland Single Malt",
    "price": 1100,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e46"
  },
  {
    "name": "JP Wiser's",
    "description": "Canadian Whiskey",
    "price": 300,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e47"
  },
  {
    "name": "LOT 40",
    "description": "RYE Whiskey",
    "price": 500,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e48"
  },
  {
    "name": "The Chita",
    "description": "Single Malt Scotch",
    "price": 950,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e49"
  },
  {
    "name": "The Deacon",
    "description": "Blended Scotch",
    "price": 420,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4a"
  },
  {
    "name": "Pike Creek",
    "description": "Canadian Whiskey",
    "price": 350,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4b"
  },
  {
    "name": "Scapa",
    "description": "Single Malt Scotch",
    "price": 670,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4c"
  },
  {
    "name": "Glenfiddich Fire&Cane",
    "description": "Single Malt Scotch",
    "price": 1100,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4d"
  },
  {
    "name": "Drambuie",
    "description": "",
    "price": 440,
    "category": "viski",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4e"
  },
  {
    "name": "Martell VS",
    "description": "Very Special",
    "price": 600,
    "category": "konyak",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e4f"
  },
  {
    "name": "Martell VSOP",
    "description": "Very Superior Old Pale",
    "price": 800,
    "category": "konyak",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e50"
  },
  {
    "name": "Kaşarlı, Sucuklu",
    "description": "Cherry domates, salatalık ve zeytin ile",
    "price": 280,
    "category": "tost-gozleme",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e51"
  },
  {
    "name": "İzmir Tulumlu, Köz Biberli",
    "description": "Cherry domates, salatalık ve zeytin ile",
    "price": 280,
    "category": "tost-gozleme",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e52"
  },
  {
    "name": "Kaşarlı, Domatesli",
    "description": "Cherry domates, salatalık ve zeytin ile",
    "price": 280,
    "category": "tost-gozleme",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e53"
  },
  {
    "name": "Beyaz Peynirli, Domatesli",
    "description": "Cherry domates, salatalık ve zeytin ile",
    "price": 280,
    "category": "tost-gozleme",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e54"
  },
  {
    "name": "Kaşarlı",
    "description": "Cherry domates, salatalık ve zeytin ile",
    "price": 280,
    "category": "tost-gozleme",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e55"
  },
  {
    "name": "Sıcak Süt",
    "description": "",
    "price": 110,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e56"
  },
  {
    "name": "Açık Büfe Kahvaltı",
    "description": "Cumartesi ve Pazar",
    "price": 900,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e57"
  },
  {
    "name": "Kahvaltı Salatası",
    "description": "Domates, salatalık, roka, maydanoz ve iki dilim peynir",
    "price": 180,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e58"
  },
  {
    "name": "Bal & Kaymak",
    "description": "",
    "price": 110,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e59"
  },
  {
    "name": "Sebzeli Omlet ve Çay",
    "description": "Kapya biber, yeşil biber ve soğan",
    "price": 170,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5a"
  },
  {
    "name": "Kasap Sucuk",
    "description": "",
    "price": 180,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5b"
  },
  {
    "name": "Zeytin",
    "description": "",
    "price": 110,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5c"
  },
  {
    "name": "Reçel",
    "description": "",
    "price": 110,
    "category": "penny-kahvalti",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5d"
  },
  {
    "name": "Pamukkale Anfora Trio Kadeh",
    "description": "Shiraz, Kalecik Karası, Cabarnet Sauvignon",
    "price": 390,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5e"
  },
  {
    "name": "Pamukkale Anfora Trio Şişe",
    "description": "Shiraz, Kalecik Karası, Cabarnet Sauvignon",
    "price": 1450,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e5f"
  },
  {
    "name": "Pamukkale Anfora Shiraz Kadeh",
    "description": "",
    "price": 390,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e60"
  },
  {
    "name": "Pamukkale Anfora Merlot Şişe",
    "description": "",
    "price": 1500,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e61"
  },
  {
    "name": "Pamukkale Anfora Merlot Kadeh",
    "description": "",
    "price": 390,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e62"
  },
  {
    "name": "Pamukkale Anfora Shiraz Şişe",
    "description": "",
    "price": 1500,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e63"
  },
  {
    "name": "Pamukkale Anfora Öküzgözü Şişe",
    "description": "",
    "price": 1500,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e64"
  },
  {
    "name": "Pamukkale Anfora Kalecik Karası Kadeh",
    "description": "",
    "price": 390,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e65"
  },
  {
    "name": "Pamukkale Grand Reserve Shiraz Şişe",
    "description": "",
    "price": 2750,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e66"
  },
  {
    "name": "Pamukkale Anfora Kalecik Karası Şişe",
    "description": "",
    "price": 1500,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e67"
  },
  {
    "name": "Suvla Kumkale Merlot Şişe",
    "description": "",
    "price": 1650,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e68"
  },
  {
    "name": "Suvla Sur Şişe",
    "description": "Merlot, Cabarnet Sauvignon, Cabarnet franc, Malbec, Petit verdot.",
    "price": 2750,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e69"
  },
  {
    "name": "Pamukkale Anfora Cabarnet Sauvignon Şişe",
    "description": "",
    "price": 1500,
    "category": "kirmizi-sarap",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6a"
  },
  {
    "name": "Pamukkale Anfora Trio Beyaz Kadeh",
    "description": "Chardonnay, Narince, Sauvignon Blanc",
    "price": 390,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6b"
  },
  {
    "name": "Pamukkale Anfora Trio Beyaz Şise",
    "description": "Chardonnay, Narince, Sauvignon Blanc",
    "price": 1450,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6c"
  },
  {
    "name": "Pamukkale Anfora Trio Rose Kadeh",
    "description": "Shiraz, Kalecik Karası, Cabarnet Sauvignon",
    "price": 390,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6d"
  },
  {
    "name": "Pamukkale Anfora Blush Şişe",
    "description": "",
    "price": 1550,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6e"
  },
  {
    "name": "Pamukkale Anfora Trio Rose Şise",
    "description": "Shiraz, Kalecik Karası, Cabarnet Sauvignon",
    "price": 1450,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e6f"
  },
  {
    "name": "Suvla Kabatepe Blush Kadeh",
    "description": "",
    "price": 390,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e70"
  },
  {
    "name": "Suvla Kabatepe Blush Şişe",
    "description": "",
    "price": 1500,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e71"
  },
  {
    "name": "Pamukkale Anfora Sauvignon Şişe",
    "description": "",
    "price": 1550,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e72"
  },
  {
    "name": "Mulier Şişe",
    "description": "50 cl",
    "price": 1550,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e73"
  },
  {
    "name": "Pamukkale Anfora Chardonnay Şişe",
    "description": "",
    "price": 1550,
    "category": "blush-rose-beyaz-kopuklu",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e74"
  },
  {
    "name": "Sangria Kadeh",
    "description": "Taze meyveler, cin, votka, şarap",
    "price": 400,
    "category": "sicak-sarap-sangria",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e75"
  },
  {
    "name": "Jagermeister",
    "description": "",
    "price": 170,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e76"
  },
  {
    "name": "Beefeater Pink",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e77"
  },
  {
    "name": "Bumbu Dark Rom",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e78"
  },
  {
    "name": "Jagermeister Coldbrew Coffee",
    "description": "",
    "price": 170,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e79"
  },
  {
    "name": "Malfy Cin",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7a"
  },
  {
    "name": "Jameson",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7b"
  },
  {
    "name": "Drambuie Shot",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7c"
  },
  {
    "name": "Olmeca Altos Tekila",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7d"
  },
  {
    "name": "Absolut Blue Votka",
    "description": "",
    "price": 200,
    "category": "snaps-shots",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7e"
  },
  {
    "name": "Americano",
    "description": "",
    "price": 120,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e7f"
  },
  {
    "name": "Cappuccino",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e80"
  },
  {
    "name": "Latte",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e81"
  },
  {
    "name": "Çaysky",
    "description": "Jameson, çay",
    "price": 200,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e82"
  },
  {
    "name": "Alkollü Kahve Çeşitleri",
    "description": "Irish, Baileys, Kahlua",
    "price": 250,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e83"
  },
  {
    "name": "Espresso",
    "description": "",
    "price": 100,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e84"
  },
  {
    "name": "Double Espresso",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e85"
  },
  {
    "name": "Filtre Kahve",
    "description": "",
    "price": 120,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e86"
  },
  {
    "name": "Bitki Çayı",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e87"
  },
  {
    "name": "Sıcak Çikolata",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e88"
  },
  {
    "name": "Sahlep",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e89"
  },
  {
    "name": "Mocha",
    "description": "",
    "price": 150,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8a"
  },
  {
    "name": "Kupa Çay",
    "description": "",
    "price": 75,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8b"
  },
  {
    "name": "Türk Kahvesi",
    "description": "",
    "price": 100,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8c"
  },
  {
    "name": "Çay",
    "description": "",
    "price": 50,
    "category": "sicak-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8d"
  },
  {
    "name": "Coca Cola, Fanta, Sprite",
    "description": "",
    "price": 120,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8e"
  },
  {
    "name": "Su",
    "description": "40",
    "price": 40,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e8f"
  },
  {
    "name": "Ev Yapımı Ice Tea Limonlu",
    "description": "Kendimiz yapıyoruz.",
    "price": 120,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e90"
  },
  {
    "name": "Taze Meyve Suyu",
    "description": "Mevsim meyveleri , 15.00’e kadar",
    "price": 150,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e91"
  },
  {
    "name": "Ice Americano",
    "description": "",
    "price": 150,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e92"
  },
  {
    "name": "Ice Latte",
    "description": "",
    "price": 150,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e93"
  },
  {
    "name": "Soda Sade",
    "description": "",
    "price": 50,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e94"
  },
  {
    "name": "Fuse Tea",
    "description": "Şeftali, Limon",
    "price": 120,
    "category": "soguk-icecekler",
    "image": "",
    "isAvailable": true,
    "isFeatured": false,
    "_id": "6a2045b27dbc1c1ec1285e95"
  },
  {
    "name": "Sufle",
    "description": "Dondurma ile",
    "price": 300,
    "category": "tatlilar",
    "image": "",
    "isAvailable": true,
    "isFeatured": true,
    "_id": "6a2045b27dbc1c1ec1285e96"
  }
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