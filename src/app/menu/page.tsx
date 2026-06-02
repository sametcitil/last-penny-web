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
  subcategory?: string;
}

const SECTIONS = [
  { id: "yemekler", label: "Yemekler & Tapas" },
  { id: "kahvalti-tatli", label: "Kahvaltı & Tatlılar" },
  { id: "kokteyller", label: "İmza Kokteyller" },
  { id: "saraplar", label: "Şaraplar" },
  { id: "fici-biralar", label: "Fıçı Biralar" },
  { id: "sise-biralar", label: "Şişe Biralar" },
  { id: "alkoller", label: "Viski & Sert Alkollüler" },
  { id: "icecekler", label: "Sıcak & Soğuk İçecekler" },
];

const TABS = [
  { id: "all", label: "Tümü" },
  ...SECTIONS,
];

// Akıllı sınıflandırma fonksiyonu
const getSectionId = (item: MenuItem): string => {
  if (item.category === "yemek") return "yemekler";
  if (item.category === "kahvalti" || item.category === "tatli") return "kahvalti-tatli";
  if (item.category === "kokteyl") return "kokteyller";
  
  const sub = (item.subcategory || "").toLowerCase();
  const name = item.name.toLowerCase();
  
  if (sub.includes("şarap") || name.includes("şarap")) return "saraplar";
  
  // Fıçı Bira
  if (sub.includes("fıçı") || sub.includes("draft") || name.includes("fıçı") || name.includes("draft")) {
    return "fici-biralar";
  }
  
  // Şişe Bira
  if (
    sub.includes("şişe") || 
    sub.includes("bottle") || 
    name.includes("şişe") || 
    name.includes("corona") || 
    name.includes("duvel") || 
    name.includes("erdinger") || 
    name.includes("hoegaarden") ||
    name.includes("gara guzu") ||
    name.includes("miller") ||
    name.includes("beck's") ||
    name.includes("stella artois") ||
    name.includes("belfast") || 
    name.includes("bomonti")
  ) {
    return "sise-biralar";
  }
  
  // Sert Alkollüler
  if (
    sub.includes("viski") || 
    sub.includes("whiskey") || 
    sub.includes("shot") || 
    sub.includes("snaps") || 
    sub.includes("konyak") || 
    sub.includes("cin & tonik") ||
    name.includes("whiskey") ||
    name.includes("viski") ||
    name.includes("chivas") ||
    name.includes("jameson") ||
    name.includes("aberlour") ||
    name.includes("glenlivet") ||
    name.includes("deacon") ||
    name.includes("shot") ||
    name.includes("altos") ||
    name.includes("absolut") ||
    name.includes("jagermeister") ||
    name.includes("gin & tonic") ||
    name.includes("martell")
  ) {
    return "alkoller";
  }
  
  // Sıcak & Soğuk Alkolsüz İçecekler
  if (
    sub.includes("sıcak") || 
    sub.includes("soğuk") || 
    sub.includes("kahve") || 
    sub.includes("çay") || 
    sub.includes("cola") || 
    sub.includes("soda") ||
    name.includes("cola") || 
    name.includes("fanta") || 
    name.includes("sprite") || 
    name.includes("soda") || 
    name.includes("su") ||
    name.includes("tea") ||
    name.includes("espresso") ||
    name.includes("americano") ||
    name.includes("latte") ||
    name.includes("cappuccino")
  ) {
    return "icecekler";
  }
  
  if (item.category === "icecek") {
    return "icecekler";
  }
  
  return "yemekler";
};

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tüm menüyü tek seferde çekiyoruz (Bant genişliği ve DB yükü optimizasyonu)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/menu");
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
  }, []);

  // Scrollspy: Sayfa kaydırıldıkça üst sekmeyi otomatik güncelleme
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

  // Tıklanan sekmeye akıcı kaydırma (smooth scroll)
  const handleTabClick = (id: string) => {
    setActiveSection(id);
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const yOffset = -140; // Yapışkan navigasyon çubuğu boşluğu
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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
              <span className="text-xs uppercase tracking-widest font-bold font-mono">Klasik & Kaliteli</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-playfair)] tracking-wide mb-4">
              Last Penny Menü
            </h1>
            <p className="text-sm md:text-base text-[var(--color-secondary)]/60 leading-relaxed">
              Kavaklıdere Büklüm&apos;deki mutfağımızdan çıkan el yapımı lezzetler, fıçı ve şişe bira çeşitleri, özenle seçilmiş şaraplar ve bar ekibimizin hazırladığı imza kokteyller.
            </p>
          </div>
        </Container>
      </section>

      {/* Sticky Filter and Search Section */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/90 backdrop-blur-md py-6 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Categories (Mobile-friendly horizontal scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x w-full md:w-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer snap-start min-h-[38px] flex items-center justify-center ${
                    activeSection === tab.id
                      ? "border-[var(--color-primary)] text-white bg-[var(--color-primary)] shadow-xs"
                      : "border-[var(--color-border)] text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]/30 bg-[var(--color-surface)]"
                  }`}
                >
                  {tab.label}
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

      {/* Menu Categories List */}
      <section className="py-12">
        <Container>
          {loading ? (
            <div className="space-y-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-[var(--color-surface)] w-1/4 rounded animate-pulse" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-14 bg-[var(--color-surface)] rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/50 font-semibold">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/40 font-semibold">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {SECTIONS.map((section) => {
                const sectionItems = filteredItems.filter((item) => getSectionId(item) === section.id);
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

                    {/* Dotted-Line Classic Menu Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
                      {sectionItems.map((item) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          key={item._id}
                          className="flex flex-col justify-start py-2 group cursor-default"
                        >
                          {/* Name, Price and Dot Fillers */}
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-center gap-2 max-w-[80%]">
                              <h3 className="font-bold text-sm md:text-base text-[var(--color-secondary)]/90 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                {item.name}
                              </h3>
                              {item.isFeatured && (
                                <span className="flex items-center gap-0.5 text-[7px] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                  <Sparkles size={6} />
                                  Popüler
                                </span>
                              )}
                            </div>
                            <div className="flex-1 border-b border-dashed border-[var(--color-border)]/60 mx-1 group-hover:border-[var(--color-primary)]/30 transition-colors duration-300" />
                            <span className="text-sm md:text-base font-extrabold text-[var(--color-primary)] font-mono shrink-0">
                              ₺{item.price}
                            </span>
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className="text-[11px] md:text-xs text-[var(--color-secondary)]/50 mt-1.5 leading-relaxed pr-8">
                              {item.description}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
