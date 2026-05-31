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
    <main className="pt-24 pb-20 min-h-screen bg-[var(--color-bg)]">
      {/* Header Banner */}
      <section className="relative py-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
        <Container>
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-[var(--color-accent)] mb-3"
            >
              <Utensils size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold">Taze ve Kaliteli</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mb-4"
            >
              Last Penny Menü
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-white/60 leading-relaxed"
            >
              Kavaklıdere Büklüm&apos;deki mutfağımızdan çıkan el yapımı lezzetler, özenle seçilmiş craft biralar ve bar ekibimizin hazırladığı imza kokteyller.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Filter and Search Section */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/80 backdrop-blur-md py-6 border-b border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 text-xs rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? "border-[var(--color-primary)] text-white"
                      : "border-white/5 text-white/50 hover:text-white/80 hover:border-white/15"
                  }`}
                >
                  {activeCategory === cat.id && (
                    <motion.span
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="text"
                placeholder="Menüde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-surface)] text-xs rounded-full pl-10 pr-4 py-2.5 border border-white/5 text-white/95 placeholder-white/30 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
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
                <div key={i} className="glass p-5 rounded-2xl animate-shimmer min-h-[160px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-white/5 w-1/3 rounded" />
                    <div className="h-3 bg-white/5 w-3/4 rounded" />
                    <div className="h-3 bg-white/5 w-1/2 rounded" />
                  </div>
                  <div className="h-6 bg-white/5 w-1/4 rounded mt-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/50">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40">Aradığın kriterlere uygun ürün bulunamadı.</p>
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
                    className="glass card-glow p-5 rounded-2xl flex flex-col justify-between hover:bg-[var(--color-surface-hover)]/40 transition-colors"
                  >
                    <div>
                      {/* Name & Badge */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-lg text-white/90">
                          {item.name}
                        </h3>
                        {item.isFeatured && (
                          <span className="flex items-center gap-1 text-[10px] bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            <Sparkles size={8} />
                            Popüler
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/50 leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Category Tag */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-white/30 uppercase tracking-widest font-mono">
                        {item.category === "icecek" ? "İçecek" : item.category}
                      </span>
                      <span className="text-lg font-bold text-[var(--color-accent)] font-mono">
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
