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
  category: "lezzet" | "mekan";
  description: string;
  gradient: string;
  icon?: LucideIcon;
  iconName?: string;
  quote?: string;
  quoteAuthor?: string;
}

const SECTIONS = [
  { id: "lezzet", label: "Last Penny Lezzetleri" },
  { id: "mekan", label: "Last Penny'den" },
];

const TABS = [
  { id: "all", label: "Tümü" },
  ...SECTIONS,
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Akustik Köşe & Caz Kütüphanesi",
    category: "mekan",
    description: "Plak dolabı, vintage hoparlörler ve loş ışıklar eşliğinde dinlenme köşesi.",
    gradient: "from-amber-950/80 via-slate-900 to-amber-900/80",
    iconName: "Coffee",
    quote: "Müzik, hislerin kelimelerle ifade edilemeyen kısmıdır.",
    quoteAuthor: "Leo Tolstoy",
  },
  {
    id: "g2",
    title: "Gece Yarısı Caz Seansı",
    category: "mekan",
    description: "Haftalık canlı caz quartet performansından nefes kesen anlar.",
    gradient: "from-indigo-950/80 via-slate-900 to-purple-900/80",
    iconName: "Music",
    quote: "Caz, özgürlüğün sesidir.",
    quoteAuthor: "Thelonious Monk",
  },
  {
    id: "g3",
    title: "Last Penny İmza Kokteylleri",
    category: "lezzet",
    description: "Bar ekibimizin taze meyveler ve el yapımı şuruplarla hazırladığı sunumlar.",
    gradient: "from-red-950/80 via-slate-900 to-rose-900/80",
    iconName: "Sparkles",
    quote: "Sanat, lezzetin bardağa dökülmüş halidir.",
  },
  {
    id: "g4",
    title: "Kitap Kulübü & Söyleşiler",
    category: "mekan",
    description: "Her Pazar topluluğumuzla bir araya gelip edebiyat ve felsefe konuştuğumuz anlar.",
    gradient: "from-teal-950/80 via-slate-900 to-emerald-900/80",
    iconName: "Coffee",
    quote: "Paylaşmak, topluluk olmanın ilk adımıdır.",
  },
  {
    id: "g5",
    title: "Pirinç Plak Çalar & Nostalji",
    category: "mekan",
    description: "Mekanın ruhunu belirleyen 1970'lerden kalma pikap ve analog tınılar.",
    gradient: "from-yellow-950/80 via-slate-900 to-amber-950/80",
    iconName: "Music",
    quote: "Sesin en sıcak hali plaktan yükselendir.",
  },
  {
    id: "g6",
    title: "Dostlarla Hafta Sonu",
    category: "mekan",
    description: "Cumartesi kahvaltısı ve Pazar kokteylleriyle paylaşılan neşeli anlar.",
    gradient: "from-fuchsia-950/80 via-slate-900 to-violet-900/80",
    iconName: "Heart",
    quote: "En güzel hikayeler, Last Penny masalarında yazılır.",
  },
];

export default function GalleryPage() {
  const [activeSection, setActiveSection] = useState("all");
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

  // Scrollspy: Sayfa kaydırıldıkça sekmeyi güncelleme
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("all");
        return;
      }

      const scrollPosition = window.scrollY + 160;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = SECTIONS[i];
        const el = document.getElementById(`section-${sec.id}`);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll
  const handleTabClick = (id: string) => {
    setActiveSection(id);
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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
              Last Penny Kavaklıdere&apos;nin vintage atmosferi, müzik geceleri ve mutfağımızdan çıkan sunumların kareleri.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Sticky Tab Filters */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/90 backdrop-blur-md py-6 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x w-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer snap-start min-h-[38px] flex items-center justify-center ${
                  activeSection === tab.id
                    ? "border-[var(--color-primary)] text-white bg-[var(--color-primary)] shadow-xs"
                    : "border-[var(--color-border)] text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]/30 bg-[var(--color-surface)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Grouped Gallery Grid */}
      <section className="py-12">
        <Container>
          {loading ? (
            <div className="text-center py-20 text-stone-500 font-semibold animate-pulse">Fotoğraflar yükleniyor...</div>
          ) : (
            <div className="space-y-16">
              {SECTIONS.map((section) => {
                const sectionItems = items.filter((item) => item.category === section.id);
                if (sectionItems.length === 0) return null;

                return (
                  <section
                    key={section.id}
                    id={`section-${section.id}`}
                    style={{ scrollMarginTop: "150px" }}
                    className="scroll-mt-40"
                  >
                    {/* Section Header */}
                    <div className="border-b border-[var(--color-border)] pb-3 mb-8">
                      <h2 className="text-xl md:text-2xl font-black font-[family-name:var(--font-playfair)] tracking-wide text-[var(--color-primary)]">
                        {section.label}
                      </h2>
                    </div>

                    {/* Sade Modern Art Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                      {sectionItems.map((item) => {
                        const IconComponent = iconMap[item.iconName] || item.icon || Camera;
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            key={item._id || item.id}
                            onClick={() => setSelectedItem(item)}
                            className="flex flex-col gap-3 group cursor-pointer"
                          >
                            {/* Visual Art Box */}
                            <div className={`relative h-60 rounded-2xl bg-gradient-to-br ${item.gradient} overflow-hidden shadow-xs group-hover:shadow-md group-hover:scale-[1.01] transition-all duration-300`}>
                              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
                              
                              {/* Maximize Icon Overlay */}
                              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 group-hover:text-white transition-all duration-300">
                                <Maximize2 size={12} className="group-hover:scale-110" />
                              </div>

                              {/* Center Icon */}
                              <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors duration-300">
                                <IconComponent size={40} strokeWidth={1} />
                              </div>
                            </div>

                            {/* Caption Underneath */}
                            <div className="space-y-1 px-1">
                              <h3 className="font-bold text-base text-[var(--color-secondary)]/90 group-hover:text-[var(--color-primary)] transition-colors duration-300 font-[family-name:var(--font-playfair)]">
                                {item.title}
                              </h3>
                              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
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
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

                {selectedItem.quote ? (
                  <div className="text-center z-10">
                    <p className="font-[family-name:var(--font-playfair)] italic text-xl md:text-2xl text-white mb-3 leading-relaxed">
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
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-100 transition-all duration-300"
                >
                  <X size={18} />
                </button>

                <div className="space-y-4 pr-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                    {selectedItem.category === "lezzet" ? "Last Penny Lezzetleri" : "Last Penny'den"}
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
