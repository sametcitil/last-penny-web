"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Maximize2, X, Music, Sparkles, Coffee, Heart, LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";

interface GalleryItem {
  id: string;
  title: string;
  category: "mekan" | "muzik" | "kokteyl" | "topluluk";
  description: string;
  gradient: string;
  icon: LucideIcon;
  quote?: string;
  quoteAuthor?: string;
}


const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Akustik Köşe & Caz Kütüphanesi",
    category: "mekan",
    description: "Plak dolabı, vintage hoparlörler ve loş ışıklar eşliğinde dinlenme köşesi.",
    gradient: "from-amber-950/80 via-slate-900 to-amber-900/80",
    icon: Coffee,
    quote: "Müzik, hislerin kelimelerle ifade edilemeyen kısmıdır.",
    quoteAuthor: "Leo Tolstoy",
  },
  {
    id: "g2",
    title: "Gece Yarısı Caz Seansı",
    category: "muzik",
    description: "Haftalık canlı caz quartet performansından nefes kesen anlar.",
    gradient: "from-indigo-950/80 via-slate-900 to-purple-900/80",
    icon: Music,
    quote: "Caz, özgürlüğün sesidir.",
    quoteAuthor: "Thelonious Monk",
  },
  {
    id: "g3",
    title: "Last Penny İmza Kokteylleri",
    category: "kokteyl",
    description: "Bar ekibimizin taze meyveler ve el yapımı şuruplarla hazırladığı sunumlar.",
    gradient: "from-red-950/80 via-slate-900 to-rose-900/80",
    icon: Sparkles,
    quote: "Sanat, lezzetin bardağa dökülmüş halidir.",
  },
  {
    id: "g4",
    title: "Kitap Kulübü & Söyleşiler",
    category: "topluluk",
    description: "Her Pazar topluluğumuzla bir araya gelip edebiyat ve felsefe konuştuğumuz anlar.",
    gradient: "from-teal-950/80 via-slate-900 to-emerald-900/80",
    icon: Coffee,
    quote: "Paylaşmak, topluluk olmanın ilk adımıdır.",
  },
  {
    id: "g5",
    title: "Pirinç Plak Çalar & Nostalji",
    category: "mekan",
    description: "Mekanın ruhunu belirleyen 1970'lerden kalma pikap ve analog tınılar.",
    gradient: "from-yellow-950/80 via-slate-900 to-amber-950/80",
    icon: Music,
    quote: "Sesin en sıcak hali plaktan yükselendir.",
  },
  {
    id: "g6",
    title: "Dostlarla Hafta Sonu",
    category: "topluluk",
    description: "Cumartesi kahvaltısı ve Pazar kokteylleriyle paylaşılan neşeli anlar.",
    gradient: "from-fuchsia-950/80 via-slate-900 to-violet-900/80",
    icon: Heart,
    quote: "En güzel hikayeler, Last Penny masalarında yazılır.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "mekan", label: "Mekan & Atmosfer" },
  { id: "muzik", label: "Canlı Müzik" },
  { id: "kokteyl", label: "Kokteyller" },
  { id: "topluluk", label: "Topluluk" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[var(--color-bg)]">
      {/* Banner */}
      <section className="relative py-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
        <Container>
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[var(--color-accent)] mb-3"
            >
              <Camera size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold">Görsel Hafıza</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mb-4"
            >
              Last Penny Galeri
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-white/60 leading-relaxed"
            >
              Last Penny Kavaklıdere&apos;nin eşsiz vintage dekorasyonu, samimi topluluk buluşmaları ve müzik gecelerinden sanatsal kareler.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/80 backdrop-blur-md py-6 border-b border-white/5">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 text-xs rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-white/5 text-white/50 hover:text-white/85 hover:border-white/15"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.span
                    layoutId="activeGalleryCategoryBg"
                    className="absolute inset-0 bg-[var(--color-accent)]/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="py-12">
        <Container>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="glass group relative h-72 rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-accent)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 cursor-pointer transition-all duration-500 flex flex-col justify-between p-6"
                  >
                    {/* Background gradient & decorative shapes */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Visual details */}
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white/90 group-hover:bg-white/10 transition-all duration-300">
                      <Maximize2 size={12} className="group-hover:scale-110" />
                    </div>

                    {/* Decorative abstract circle representation */}
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent)] z-10">
                      <IconComponent size={20} />
                    </div>

                    {/* Card Footer Content */}
                    <div className="z-10 mt-auto">
                      <span className="text-[10px] font-mono tracking-widest text-[var(--color-accent)] uppercase mb-1 block">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-lg text-white/90 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[450px]"
            >
              {/* Left visual representation */}
              <div className={`md:w-1/2 h-64 md:h-full bg-gradient-to-br ${selectedItem.gradient} relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)]" />
                {/* Visual shapes */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

                {selectedItem.quote ? (
                  <div className="text-center z-10">
                    <p className="font-[family-name:var(--font-playfair)] italic text-xl md:text-2xl text-[var(--color-secondary)] mb-3">
                      &ldquo;{selectedItem.quote}&rdquo;
                    </p>
                    {selectedItem.quoteAuthor && (
                      <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                        — {selectedItem.quoteAuthor}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-center z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent)]">
                      {<selectedItem.icon size={30} />}
                    </div>
                    <span className="font-[family-name:var(--font-playfair)] tracking-widest text-lg font-semibold text-[var(--color-secondary)]">
                      LAST PENNY
                    </span>
                  </div>
                )}
              </div>

              {/* Right content details */}
              <div className="md:w-1/2 p-8 flex flex-col justify-between relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white/90 p-1.5 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  <X size={18} />
                </button>

                <div className="space-y-4 pr-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                    {selectedItem.category}
                  </span>
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-white/95">
                    {selectedItem.title}
                  </h2>
                  <p className="text-sm text-white/60 leading-relaxed pt-2">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Camera size={13} className="text-[var(--color-primary)]" />
                    Last Penny Atmosfer
                  </span>
                  <span>Ankara, Kavaklıdere</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
