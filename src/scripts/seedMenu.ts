/**
 * Last Penny Büklüm — Menü Seed Script (v2 - mevcut model ile uyumlu)
 * Çalıştırmak: npx tsx src/scripts/seedMenu.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { menuItems } from '../constants/menuData';

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