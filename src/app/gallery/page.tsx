"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Maximize2, X } from "lucide-react";
import Container from "@/components/ui/Container";

interface GalleryItem {
  id?: string;
  _id?: string;
  title: string;
  category: "lezzet" | "mekan";
  image: string;
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
    image: "/interior.jpg",
  },
  {
    id: "g2",
    title: "Gece Yarısı Caz Seansı",
    category: "mekan",
    image: "/stage.jpg",
  },
  {
    id: "g3",
    title: "Last Penny İmza Kokteylleri",
    category: "lezzet",
    image: "/bar.jpg",
  },
  {
    id: "g4",
    title: "Kitap Kulübü & Söyleşiler",
    category: "mekan",
    image: "/patio.png",
  },
  {
    id: "g5",
    title: "Pirinç Plak Çalar & Nostalji",
    category: "mekan",
    image: "/sign.png",
  },
  {
    id: "g6",
    title: "Dostlarla Hafta Sonu",
    category: "mekan",
    image: "/interior.jpg",
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {sectionItems.map((item) => {
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            key={item._id || item.id}
                            onClick={() => setSelectedItem(item)}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all duration-300 group"
                          >
                            <img
                              src={item.image}
                              alt="Last Penny Galeri Görseli"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                                <Maximize2 size={16} />
                              </div>
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
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xs flex items-center justify-center p-4 md:p-10"
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <X size={20} />
              </button>
              <img
                src={selectedItem.image}
                alt="Last Penny Galeri Büyütülmüş Görsel"
                className="w-full h-full object-contain rounded-2xl max-h-[85vh] select-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
