"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Utensils } from "lucide-react";
import Container from "@/components/ui/Container";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "yemek" | "kokteyl" | "icecek" | "tatli" | "kahvalti";
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "yemek", label: "Yemekler" },
  { id: "kokteyl", label: "İmza Kokteyller" },
  { id: "icecek", label: "İçecekler" },
  { id: "tatli", label: "Tatlılar" },
  { id: "kahvalti", label: "Kahvaltı" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const url = activeCategory === "all" 
          ? "/api/menu" 
          : `/api/menu?category=${activeCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setMenuItems(data.items);
        } else {
          setError("Menü yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        console.error(err);
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [activeCategory]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[var(--color-bg)] text-[var(--color-secondary)]">
      {/* Header Banner */}
      <section className="relative py-16 overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
        <Container>
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[var(--color-primary)] mb-3"
            >
              <Utensils size={16} />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">Taze ve Kaliteli</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-playfair)] tracking-wide mb-4">
              Last Penny Menü
            </h1>
            <p className="text-sm md:text-base text-[var(--color-secondary)]/60 leading-relaxed">
              Kavaklıdere Büklüm&apos;deki mutfağımızdan çıkan el yapımı lezzetler, özenle seçilmiş craft biralar ve bar ekibimizin hazırladığı imza kokteyller.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter and Search Section */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/90 backdrop-blur-md py-6 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Categories (Mobile-friendly horizontal scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer snap-start min-h-[38px] flex items-center justify-center ${
                    activeCategory === cat.id
                      ? "border-[var(--color-primary)] text-white bg-[var(--color-primary)] shadow-sm"
                      : "border-[var(--color-border)] text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]/30 bg-[var(--color-surface)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]/30" size={16} />
              <input
                type="text"
                placeholder="Menüde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-surface)] text-xs rounded-full pl-10 pr-4 py-3 border border-[var(--color-border)] text-[var(--color-secondary)] placeholder-[var(--color-secondary)]/30 focus:border-[var(--color-primary)] focus:outline-none transition-colors shadow-xs min-h-[40px]"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl animate-shimmer min-h-[160px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-[var(--color-surface-hover)] w-1/3 rounded" />
                    <div className="h-3 bg-[var(--color-surface-hover)] w-3/4 rounded" />
                    <div className="h-3 bg-[var(--color-surface-hover)] w-1/2 rounded" />
                  </div>
                  <div className="h-6 bg-[var(--color-surface-hover)] w-1/4 rounded mt-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/50 font-semibold">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/40 font-semibold">Aradığın kriterlere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={item._id}
                    className="bg-[var(--color-surface)] p-5 rounded-2xl flex flex-col justify-between hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300 border border-[var(--color-border)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[var(--color-primary)]/5 before:rounded-t-2xl hover:before:bg-[var(--color-primary)]/30"
                  >
                    <div>
                      {/* Name & Badge */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-lg text-[var(--color-secondary)]/90">
                          {item.name}
                        </h3>
                        {item.isFeatured && (
                          <span className="flex items-center gap-1 text-[8px] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            <Sparkles size={8} />
                            Popüler
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--color-secondary)]/60 leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Category Tag */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)]/50">
                      <span className="text-[10px] text-[var(--color-secondary)]/40 uppercase tracking-widest font-mono font-bold">
                        {item.category === "icecek" ? "İçecek" : item.category}
                      </span>
                      <span className="text-lg font-bold text-[var(--color-primary)] font-mono">
                        ₺{item.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>
    </main>
  );
}
