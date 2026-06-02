"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Maximize2, X, Music, Sparkles, Coffee, Heart, LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";

const iconMap: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Music: Music,
  Sparkles: Sparkles,
  Heart: Heart,
  Camera: Camera,
};

interface GalleryItem {
  id?: string;
  _id?: string;
  title: string;
  category: "mekan" | "muzik" | "kokteyl" | "topluluk";
  description: string;
  gradient: string;
  icon?: LucideIcon;
  iconName?: string;
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

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (res.ok && data.items && data.items.length > 0) {
          setItems(data.items);
        } else {
          setItems(GALLERY_ITEMS);
        }
      } catch (err) {
        console.error("Failed to load gallery items, using fallback:", err);
        setItems(GALLERY_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[var(--color-bg)]">
      {/* Banner */}
      <section className="relative py-16 overflow-hidden border-b border-[var(--color-border)]">
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
              className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mb-4 text-[var(--color-secondary)]"
            >
              Last Penny Galeri
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-zinc-600 leading-relaxed"
            >
              Last Penny Kavaklıdere&apos;nin eşsiz vintage dekorasyonu, samimi topluluk buluşmaları ve müzik gecelerinden sanatsal kareler.
            </motion.p>
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
              {loading ? (
                <div className="col-span-full text-center py-20 text-stone-500 font-semibold animate-pulse">Fotoğraflar yükleniyor...</div>
              ) : items.map((item) => {
                const IconComponent = iconMap[item.iconName] || item.icon || Camera;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={item._id || item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white group relative h-80 rounded-none border-[12px] border-[#3E2723] p-3 shadow-lg hover:shadow-2xl hover:scale-[1.01] cursor-pointer transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Mat/Paspartu border inside the wood frame */}
                    <div className="relative w-full h-full bg-[#FAF9F6] border border-stone-200 p-4 flex flex-col justify-between overflow-hidden">
                      {/* Inner artwork gradient representation */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      
                      {/* Visual details */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 group-hover:text-white transition-all duration-300">
                        <Maximize2 size={12} className="group-hover:scale-110" />
                      </div>

                      {/* Accent Icon */}
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-200 z-10">
                        <IconComponent size={18} />
                      </div>

                      {/* Card Content Overlay */}
                      <div className="z-10 mt-auto">
                        <span className="text-[9px] font-mono tracking-widest text-amber-200 uppercase mb-1 block">
                          {item.category}
                        </span>
                        <h3 className="font-semibold text-base font-[family-name:var(--font-playfair)] text-white/90 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-white/70 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.description}
                        </p>
                      </div>
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
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh] md:h-[450px]"
            >
              {/* Left visual representation */}
              <div className={`md:w-1/2 h-64 md:h-full bg-gradient-to-br ${selectedItem.gradient} relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[var(--color-border)] overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)]" />
                {/* Visual shapes */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

                {selectedItem.quote ? (
                  <div className="text-center z-10">
                    <p className="font-[family-name:var(--font-playfair)] italic text-xl md:text-2xl text-white mb-3">
                      &ldquo;{selectedItem.quote}&rdquo;
                    </p>
                    {selectedItem.quoteAuthor && (
                      <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
                        — {selectedItem.quoteAuthor}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-center z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-200">
                      {(() => {
                        const Icon = iconMap[selectedItem.iconName] || selectedItem.icon || Camera;
                        return <Icon size={30} />;
                      })()}
                    </div>
                    <span className="font-[family-name:var(--font-playfair)] tracking-widest text-lg font-semibold text-white">
                      LAST PENNY
                    </span>
                  </div>
                )}
              </div>

              {/* Right content details */}
              <div className="md:w-1/2 p-8 flex flex-col justify-between relative bg-white">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-100 transition-all duration-300"
                >
                  <X size={18} />
                </button>

                <div className="space-y-4 pr-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                    {selectedItem.category}
                  </span>
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[var(--color-secondary)]">
                    {selectedItem.title}
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed pt-2">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-zinc-500">
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
