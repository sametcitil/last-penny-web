/**
 * Last Penny Büklüm — Menü Seed Script (v2 - mevcut model ile uyumlu)
 * Çalıştırmak: npx tsx src/scripts/seedMenu.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MenuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, enum: ['yemek', 'icecek', 'tatli', 'kahvalti', 'kokteyl'], required: true },
  image:       { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  subcategory: { type: String, default: '' },
}, { timestamps: true });

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

const menuItems = [
  // ── Fıçı Bira ──────────────────────────────────────────────────────
  { name: 'Efes Pilsen Bavyera',     price: 500, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'Efes Pilsen Pint',        price: 260, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'Efes Pilsen Half Pint',   price: 130, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'Stella Artois Pint',      price: 350, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'Stella Artois Half Pint', price: 175, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: "Beck's Pint",             price: 290, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: "Beck's Half Pint",        price: 145, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'NeIpa Pint',              price: 440, category: 'icecek', subcategory: 'Fıçı Bira', description: '', isAvailable: false },
  { name: 'American Bud Pint',       price: 350, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'American Bud Half Pint',  price: 175, category: 'icecek', subcategory: 'Fıçı Bira', description: '' },
  { name: 'American Porter Pint',    price: 450, category: 'icecek', subcategory: 'Fıçı Bira', isFeatured: true,
    description: 'Katmanlı, zengin ve yoğun gövdeli. Kahve, çikolata, kakao, koyu karamel ve kızarmış ekmek notaları. ABV:%6.0 IBU:33' },

  // ── Şişe Bira ──────────────────────────────────────────────────────
  { name: 'Stella Artois 44 cl',     price: 315, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'American Bud 50cl',       price: 315, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Miller 33cl',             price: 290, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Miller Lime 33cl',        price: 290, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Corona 35,5cl',           price: 410, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Duvel 33cl',              price: 550, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Hoegaarden 33cl',         price: 430, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Erdinger 33cl',           price: 430, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: "Beck's 33cl",             price: 280, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Belfast 50cl',            price: 290, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Bomonti Filtresiz 50cl',  price: 300, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Efes Pilsen 33cl',        price: 220, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Efes Glutensiz 50cl',     price: 350, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Efes Green 50cl',         price: 290, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Efes Malt 50cl',          price: 270, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Red Ale 33cl',  price: 450, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Amber Ale 33cl',price: 450, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu IPA 4C 33cl',   price: 450, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Porter 33cl',   price: 450, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Mayhoş 33cl',   price: 450, category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Weiss Bier 33cl',price: 450,category: 'icecek', subcategory: 'Şişe Bira', description: '' },
  { name: 'Gara Guzu Summer IPA 33cl',price: 450,category: 'icecek', subcategory: 'Şişe Bira', description: '', isAvailable: false },
  { name: 'Gara Guzu Ters Köşe 33cl', price: 450,category: 'icecek', subcategory: 'Şişe Bira', description: '', isAvailable: false },
  { name: 'Gara Guzu Blonde Ale 33cl',price: 450,category: 'icecek', subcategory: 'Şişe Bira', description: '', isAvailable: false },

  // ── Penny Signature (kokteyl) ───────────────────────────────────────
  { name: 'London Refresher',   price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Malfy cin, Salatalık, Fesleğen, Taze sıkılmış limon suyu, ev yapımı şeker şurubu' },
  { name: 'Strawberry Collins', price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Malfy cin, Çilek, Soda, Nane' },
  { name: 'Berry B. Goode',     price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: "Wiser's Canadian whiskey, Jameson Black Barrel, Böğürtlen, Limon, Nane, Aquafaba" },
  { name: 'Chopper',            price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Çilek veya karpuz, Fesleğen, Limon suyu, Absolut votka' },
  { name: 'Southside Sour',     price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Malfy Gin, Taze sıkılmış lime suyu, Aquafaba, Ev yapımı şeker şurubu, Nane' },
  { name: 'Smells Like Tropic Spirit', price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Olmeca Altos, Malibu, Reyhan, Taze sıkılmış limon suyu, Ev yapımı şeker şurubu, Aquafaba' },
  { name: 'Berry Collins',      price: 600, category: 'kokteyl', subcategory: 'Penny Signature',
    description: 'Absolut raspberry, böğürtlen, nane, limon suyu, soda' },
  { name: 'Sangria Kadeh',      price: 400, category: 'kokteyl', subcategory: 'Sangria',
    description: 'Taze meyveler, cin, votka, şarap' },
  { name: 'Sangria Sürahi',     price: 1400, category: 'kokteyl', subcategory: 'Sürahi', description: '' },
  { name: 'London Refresher Sürahi', price: 2150, category: 'kokteyl', subcategory: 'Sürahi', description: '' },

  // ── Cin & Tonik ────────────────────────────────────────────────────
  { name: "Hendrick's Gin & Tonic", price: 700, category: 'icecek', subcategory: 'Cin & Tonik', description: '' },
  { name: 'Malfy Gin & Tonic',      price: 500, category: 'icecek', subcategory: 'Cin & Tonik', description: '' },

  // ── Viski ──────────────────────────────────────────────────────────
  { name: 'Aberlour 12yo Speyside Single Malt Scotch', price: 630,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Aberlour 14yo Speyside Single Malt Scotch', price: 820,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Aberlour 18yo Speyside Single Malt Scotch', price: 1650, category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Chivas 12yo Blended Scotch',                price: 375,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Chivas 15yo Blended Scotch',                price: 600,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Chivas 18yo Blended Scotch',                price: 800,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Chivas Extra Sherry',                       price: 440,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Chivas Extra Smoky Blended Scotch',         price: 440,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'The Glenlivet 12 Single Malt Scotch',       price: 550,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'The Glenlivet 15 Single Malt Scotch',       price: 880,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'The Glenlivet 18 Single Malt Scotch',       price: 1100, category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Jameson Irish',                             price: 330,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Jameson IPA Edition Irish',                 price: 330,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Jameson Stout Edition Irish',               price: 330,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Jameson Black Barrel Irish',                price: 400,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: "JP Wiser's Canadian Whiskey",               price: 300,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'LOT 40 RYE Whiskey',                        price: 500,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'The Chita Single Malt Scotch',              price: 950,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'The Deacon Blended Scotch',                 price: 420,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Pike Creek Canadian Whiskey',               price: 350,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Scapa Single Malt Scotch',                  price: 670,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Glenfiddich Fire&Cane Single Malt Scotch',  price: 1100, category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Drambuie',                                  price: 440,  category: 'icecek', subcategory: 'Viski', description: '' },
  { name: 'Macallan 12 Highland Single Malt',          price: 1100, category: 'icecek', subcategory: 'Viski', description: '', isAvailable: false },

  // ── Konyak ─────────────────────────────────────────────────────────
  { name: 'Martell VS Very Special',             price: 600, category: 'icecek', subcategory: 'Konyak', description: '' },
  { name: 'Martell VSOP Very Superior Old Pale', price: 800, category: 'icecek', subcategory: 'Konyak', description: '', isAvailable: false },

  // ── Snaps & Shots ──────────────────────────────────────────────────
  { name: 'Jagermeister',              price: 170, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Beefeater Pink',            price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Bumbu Dark Rom',            price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Malfy Cin Shot',            price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Jameson Shot',              price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Drambuie Shot',             price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Olmeca Altos Tekila',       price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Absolut Blue Votka',        price: 200, category: 'icecek', subcategory: 'Snaps & Shots', description: '' },
  { name: 'Jagermeister Coldbrew Coffee', price: 170, category: 'icecek', subcategory: 'Snaps & Shots', description: '', isAvailable: false },

  // ── Sıcak İçecekler ────────────────────────────────────────────────
  { name: 'Espresso',         price: 100, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Double Espresso',  price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Americano',        price: 120, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Filtre Kahve',     price: 120, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Cappuccino',       price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Latte',            price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Mocha',            price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Sıcak Çikolata',   price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Sahlep',           price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Bitki Çayı',       price: 150, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Çay',              price: 50,  category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Kupa Çay',         price: 75,  category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Türk Kahvesi',     price: 100, category: 'icecek', subcategory: 'Sıcak İçecekler', description: '' },
  { name: 'Çaysky',           price: 200, category: 'icecek', subcategory: 'Sıcak İçecekler', description: 'Jameson, çay' },
  { name: 'Alkollü Kahve',    price: 250, category: 'icecek', subcategory: 'Sıcak İçecekler',
    description: 'Irish, Baileys veya Kahlua ile' },

  // ── Soğuk İçecekler ────────────────────────────────────────────────
  { name: 'Coca Cola / Fanta / Sprite', price: 120, category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Su',                         price: 40,  category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Soda Sade',                  price: 50,  category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Ev Yapımı Ice Tea Limonlu',  price: 120, category: 'icecek', subcategory: 'Soğuk İçecekler', description: 'Kendimiz yapıyoruz.' },
  { name: 'Fuse Tea Şeftali / Limon',   price: 120, category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Ice Americano',              price: 150, category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Ice Latte',                  price: 150, category: 'icecek', subcategory: 'Soğuk İçecekler', description: '' },
  { name: 'Taze Meyve Suyu',            price: 150, category: 'icecek', subcategory: 'Soğuk İçecekler', description: 'Mevsim meyveleri. 15:00\'e kadar.' },

  // ── Kırmızı Şarap ──────────────────────────────────────────────────
  { name: 'Pamukkale Anfora Trio Kadeh',              price: 390,  category: 'icecek', subcategory: 'Kırmızı Şarap',
    description: 'Shiraz, Kalecik Karası, Cabarnet Sauvignon' },
  { name: 'Pamukkale Anfora Trio Şişe',               price: 1450, category: 'icecek', subcategory: 'Kırmızı Şarap',
    description: 'Shiraz, Kalecik Karası, Cabarnet Sauvignon' },
  { name: 'Pamukkale Anfora Shiraz Kadeh',            price: 390,  category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Shiraz Şişe',             price: 1500, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Merlot Kadeh',            price: 390,  category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Merlot Şişe',             price: 1500, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Öküzgözü Şişe',          price: 1500, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Kalecik Karası Kadeh',    price: 390,  category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Kalecik Karası Şişe',     price: 1500, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Grand Reserve Shiraz Şişe',      price: 2750, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Pamukkale Anfora Cabarnet Sauvignon Şişe', price: 1500, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '' },
  { name: 'Suvla Sur Şişe',                          price: 2750, category: 'icecek', subcategory: 'Kırmızı Şarap',
    description: 'Merlot, Cabarnet Sauvignon, Cabarnet Franc, Malbec, Petit Verdot' },
  { name: 'Suvla Kumkale Merlot Şişe',               price: 1650, category: 'icecek', subcategory: 'Kırmızı Şarap', description: '', isAvailable: false },

  // ── Beyaz & Rosé Şarap ─────────────────────────────────────────────
  { name: 'Pamukkale Anfora Trio Beyaz Kadeh',  price: 390,  category: 'icecek', subcategory: 'Beyaz & Rosé Şarap',
    description: 'Chardonnay, Narince, Sauvignon Blanc' },
  { name: 'Pamukkale Anfora Trio Beyaz Şişe',   price: 1450, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap',
    description: 'Chardonnay, Narince, Sauvignon Blanc' },
  { name: 'Pamukkale Anfora Trio Rosé Kadeh',   price: 390,  category: 'icecek', subcategory: 'Beyaz & Rosé Şarap',
    description: 'Shiraz, Kalecik Karası, Cabarnet Sauvignon' },
  { name: 'Pamukkale Anfora Trio Rosé Şişe',    price: 1450, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap',
    description: 'Shiraz, Kalecik Karası, Cabarnet Sauvignon' },
  { name: 'Pamukkale Anfora Blush Şişe',        price: 1550, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '' },
  { name: 'Pamukkale Anfora Sauvignon Şişe',    price: 1550, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '' },
  { name: 'Mulier Şişe 50 cl',                  price: 1550, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '' },
  { name: 'Pamukkale Anfora Chardonnay Şişe',   price: 1550, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '' },
  { name: 'Suvla Kabatepe Blush Kadeh',         price: 390,  category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '', isAvailable: false },
  { name: 'Suvla Kabatepe Blush Şişe',          price: 1500, category: 'icecek', subcategory: 'Beyaz & Rosé Şarap', description: '', isAvailable: false },

  // ── Doyuranlar ─────────────────────────────────────────────────────
  { name: 'Kasap Köfte',      price: 550, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Acı sos, kahvaltılık patates kızartması, turşu, ızgara biber ve domates ile' },
  { name: 'Zerdeçallı Tavuk', price: 500, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Zerdeçal ve bal ile marine edilmiş tavuk göğsü, patates püresi ve mevsim salata ile' },
  { name: 'Fish & Chips',     price: 600, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Mezgit, salsa ve tartar sos, roka, lahana turşusu ve patatas bravas ile' },
  { name: 'Baharatlı Sosis',  price: 600, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Burger sos, cheddar, karamelize soğan ve bravas ile' },
  { name: 'Penny Burger',     price: 570, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Ev yapımı burger ekmeğine 150gr burger köftesi, karamelize soğan, burger sos, cheddar sos, domates, göbek marul ve bravas ile' },
  { name: 'Jameson Burger',   price: 600, category: 'yemek', subcategory: 'Doyuranlar',
    description: 'Ev yapımı tereyağlı burger ekmeğine 150gr katkısız burger köftesi, ızgara füme et, karamelize soğan, viski sos, alman turşusu, domates, göbek marul ve bravas ile' },
  { name: 'Penny Tavuk Burger', price: 480, category: 'yemek', subcategory: 'Doyuranlar', isFeatured: true,
    description: 'Ev Yapımı Tereyağlı Burger Ekmeğine 150gr Panelenmiş Tavuk Eti, Göbek Marul, Domates, Acılı Közbiber Püresi, Alman Turşusu, Ballı Hardal Sos ve Patates Bravas ile' },
  { name: 'Pad Thai Tavuklu', price: 550, category: 'yemek', subcategory: 'Doyuranlar', isAvailable: false,
    description: 'Rice Stick, pad thai sos, havuç, lahana, taze soğan, iç fıstık, julyen tavuk göğsü' },
  { name: 'Pad Thai Karides', price: 600, category: 'yemek', subcategory: 'Doyuranlar', isAvailable: false,
    description: 'Rice Stick, lahana, havuç, taze soğan, jumbo karides, pad thai sos, iç fıstık' },
  { name: 'Pad Thai Sebzeli', price: 380, category: 'yemek', subcategory: 'Doyuranlar', isAvailable: false,
    description: 'Rice stick, pad thai sos, havuç, lahana, iç fıstık, taze soğan' },

  // ── Elle Ye! ───────────────────────────────────────────────────────
  { name: 'Dana Etli Burrito', price: 550, category: 'yemek', subcategory: 'Elle Ye!',
    description: 'Dana eti, sebze, iceberg, cheddar sos ve bravas ile' },
  { name: 'Çıtır Tavuk',       price: 440, category: 'yemek', subcategory: 'Elle Ye!',
    description: 'Panelenmiş tavuk, tartar ve salsa sos ile' },
  { name: 'Tavuk Sandviç',     price: 500, category: 'yemek', subcategory: 'Elle Ye!',
    description: 'Izgara tavuk göğüs, karamelize soğan, göbek marul ve bravas ile' },

  // ── Salatalar ──────────────────────────────────────────────────────
  { name: 'Sezar Salata', price: 390, category: 'yemek', subcategory: 'Salatalar',
    description: 'Tavuk Bonfile, Iceberg, Parmesan, Kruton Ekmek, Sezar Sos ile' },

  // ── Tapas ──────────────────────────────────────────────────────────
  { name: 'Patatas Bravas Parmesan', price: 310, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Patatas Bravas Cheddar',  price: 310, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Patatas Bravas Sloppy',   price: 400, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Patatas Bravas Sade',     price: 275, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Junior Bravas Parmesan',  price: 250, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Junior Bravas Cheddar',   price: 250, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Junior Bravas Sloppy',    price: 275, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Junior Bravas Sade',      price: 220, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Falafel',                 price: 380, category: 'yemek', subcategory: 'Tapas',
    description: 'Nohut Falafel, Izgara Zeytinli Domatesli Roka Salatası, Yoğurt ve Tahin Sos ile' },
  { name: 'Humus Vegan',             price: 350, category: 'yemek', subcategory: 'Tapas',
    description: 'Domates, turşu, zeytinyağı ve ev yapımı tortilla chips ile' },
  { name: 'Humus Roll',              price: 410, category: 'yemek', subcategory: 'Tapas',
    description: 'Tortillaya sarılı humus, turşu, domates. Üzerine füme kaburga ve roka ile.' },
  { name: 'Penny Nachos',            price: 410, category: 'yemek', subcategory: 'Tapas',
    description: 'Chili Con Carne Eşliğinde Cheddar Peyniri, Sos ve Nachos' },
  { name: 'Nachos Cheddar',          price: 275, category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Nachos Sade',             price: 220, category: 'yemek', subcategory: 'Tapas',
    description: 'Salsa sos ve tartar sos ile servis ediyoruz' },
  { name: 'Peynir Tabağı',           price: 600, category: 'yemek', subcategory: 'Tapas',
    description: 'Gouda, Edam, Kars Gravyer ve İsli Çerkes Peyniri' },
  { name: 'Zeytin Tabağı',           price: 220, category: 'yemek', subcategory: 'Tapas',
    description: '3 çeşit karışık zeytin' },
  { name: 'Ekstra Cheddar',          price: 50,  category: 'yemek', subcategory: 'Tapas', description: '' },
  { name: 'Mücver',                  price: 350, category: 'yemek', subcategory: 'Tapas', isAvailable: false,
    description: 'Roka, parmesan peyniri ve bravas sos ile' },

  // ── Kahvaltı ───────────────────────────────────────────────────────
  { name: 'Açık Büfe Kahvaltı', price: 900, category: 'kahvalti', subcategory: 'Kahvaltı',
    description: 'Cumartesi ve Pazar' },
  { name: 'Kahvaltı Salatası',  price: 180, category: 'kahvalti', subcategory: 'Kahvaltı',
    description: 'Domates, salatalık, roka, maydanoz ve iki dilim peynir' },
  { name: 'Bal & Kaymak',       price: 110, category: 'kahvalti', subcategory: 'Kahvaltı', description: '' },
  { name: 'Sebzeli Omlet ve Çay',price: 170, category: 'kahvalti', subcategory: 'Kahvaltı',
    description: 'Kapya biber, yeşil biber ve soğan' },
  { name: 'Kasap Sucuk',        price: 180, category: 'kahvalti', subcategory: 'Kahvaltı', description: '' },
  { name: 'Zeytin',             price: 110, category: 'kahvalti', subcategory: 'Kahvaltı', description: '' },
  { name: 'Reçel',              price: 110, category: 'kahvalti', subcategory: 'Kahvaltı', description: '' },
  { name: 'Sıcak Süt',          price: 110, category: 'kahvalti', subcategory: 'Kahvaltı', description: '' },
  { name: 'Kaşarlı, Sucuklu',   price: 280, category: 'kahvalti', subcategory: 'Tost',
    description: 'Cherry domates, salatalık ve zeytin ile' },
  { name: 'İzmir Tulumlu, Köz Biberli', price: 280, category: 'kahvalti', subcategory: 'Tost',
    description: 'Cherry domates, salatalık ve zeytin ile' },
  { name: 'Kaşarlı, Domatesli', price: 280, category: 'kahvalti', subcategory: 'Tost',
    description: 'Cherry domates, salatalık ve zeytin ile' },
  { name: 'Beyaz Peynirli, Domatesli', price: 280, category: 'kahvalti', subcategory: 'Tost',
    description: 'Cherry domates, salatalık ve zeytin ile' },
  { name: 'Kaşarlı Tost',       price: 280, category: 'kahvalti', subcategory: 'Tost',
    description: 'Cherry domates, salatalık ve zeytin ile' },

  // ── Tatlı ──────────────────────────────────────────────────────────
  { name: 'Sufle', price: 300, category: 'tatli', subcategory: 'Tatlılar',
    description: 'Dondurma ile', isAvailable: false },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI bulunamadı. .env.local dosyanızı kontrol edin.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  MongoDB bağlantısı kuruldu.');

  const deleted = await MenuItem.deleteMany({});
  console.log(`🗑   ${deleted.deletedCount} eski menü öğesi silindi.`);

  const inserted = await MenuItem.insertMany(menuItems);
  console.log(`🍽   ${inserted.length} menü öğesi eklendi.`);

  await mongoose.disconnect();
  console.log('🔌  Bağlantı kapatıldı. Seed tamamlandı!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});