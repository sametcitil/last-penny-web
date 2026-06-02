"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, AlertCircle, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "tshirt" | "hoodie" | "cap" | "accessory";
  image: string;
  sizes: string[];
  stock: number;
}

const CATEGORIES = [
  { id: "all", label: "Tüm Ürünler" },
  { id: "tshirt", label: "Tişörtler" },
  { id: "hoodie", label: "Sweatshirtler" },
  { id: "cap", label: "Şapkalar" },
  { id: "accessory", label: "Aksesuarlar" },
];

export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Track selected size for each product using its ID as key
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = activeCategory === "all" 
          ? "/api/merch" 
          : `/api/merch?category=${activeCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          
          // Set initial default sizes for products
          const initialSizes: Record<string, string> = {};
          data.products.forEach((p: Product) => {
            if (p.sizes && p.sizes.length > 0) {
              initialSizes[p._id] = p.sizes[0];
            }
          });
          setSelectedSizes(initialSizes);
        } else {
          setError("Ürünler yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        console.error(err);
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
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
              <ShoppingBag size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold font-mono">Last Penny Wear</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mb-4 text-[var(--color-secondary)]"
            >
              Last Penny Mağaza
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-zinc-600 leading-relaxed font-sans"
            >
              Kavaklıdere caz esintisini sokak stiline taşıyan özel koleksiyonumuz. Kaliteli kumaşlar, sınırlı sayıda üretilen tasarımlar ve vintage aksesuarlar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-4 py-3 rounded-xl text-xs md:text-sm text-[var(--color-primary)] font-semibold"
            >
              <Sparkles size={16} className="text-[var(--color-primary)] animate-pulse shrink-0" />
              <span>Online alışveriş özelliğimiz çok yakında hizmetinizde olacaktır! Şu anda ürünlerimizi Last Penny şubemizi ziyaret ederek satın alabilirsiniz.</span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Filter Options */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/80 backdrop-blur-md py-6 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 text-xs rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                    : "border-[var(--color-border)] text-zinc-600 hover:text-[var(--color-secondary)] hover:border-zinc-400 bg-white"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.span
                    layoutId="activeMerchCategoryBg"
                    className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Listing */}
      <section className="py-12">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl animate-pulse min-h-[400px] flex flex-col justify-between">
                  <div className="h-60 bg-zinc-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-zinc-100 w-1/3 rounded" />
                    <div className="h-6 bg-zinc-100 w-3/4 rounded" />
                    <div className="h-4 bg-zinc-100 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
              <p className="text-zinc-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
              <p className="text-zinc-500">Mağazamızda şu an bu kategoride ürün bulunmamaktadır.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {products.map((p) => {
                  const hasSizes = p.sizes && p.sizes.length > 0 && p.sizes[0] !== "Standart";
                  const selectedSize = selectedSizes[p._id] || "Standart";

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={p._id}
                      className="bg-white overflow-hidden rounded-xl border border-[var(--color-border)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Product Preview Box - Stylized CSS instead of broken image link */}
                      <div className="relative h-60 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center border-b border-[var(--color-border)] group overflow-hidden">
                        {/* Huge Abstract Text/Logo for style */}
                        <div className="text-[120px] font-bold text-black/[0.03] select-none font-[family-name:var(--font-playfair)] tracking-wider group-hover:scale-110 transition-transform duration-700">
                          LP
                        </div>

                        {/* Top Accent Icon */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-border)] shadow-sm">
                          <Sparkles size={14} className="animate-pulse text-[var(--color-primary)]" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Name and Price */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-lg text-[var(--color-secondary)]">
                              {p.name}
                            </h3>
                            <span className="font-bold text-lg text-[var(--color-primary)] font-mono shrink-0">
                              ₺{p.price}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                            {p.description}
                          </p>

                          {/* Sizes selection */}
                          {hasSizes && (
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono">Beden Seç:</span>
                              <div className="flex gap-2">
                                {p.sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleSizeChange(p._id, size)}
                                    className={`px-3 py-1 text-xs rounded font-mono border transition-all cursor-pointer ${
                                      selectedSize === size
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold"
                                        : "border-[var(--color-border)] text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 bg-white"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-[10px] flex items-center gap-1.5 text-zinc-500 font-mono">
                            {p.stock > 0 ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                                <span>Mekanda Mevcut</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                <span>Tükendi</span>
                              </>
                            )}
                          </div>

                          <div className="inline-flex items-center gap-1 text-[10px] text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 px-2.5 py-1.5 rounded-lg">
                            <MapPin size={11} className="shrink-0" />
                            <span>Satın almak için mekana bekleriz</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Info Notice */}
      <section className="py-8 border-t border-[var(--color-border)]">
        <Container>
          <div className="bg-[#FFFDF9] border border-amber-500/20 p-5 rounded-2xl flex items-start gap-3 max-w-xl mx-auto">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Satın Alma Bilgilendirmesi</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Şu an için online satış hizmetimiz aktif değildir. Tüm koleksiyon ürünlerimizi şubemizi (Last Penny) ziyaret ederek inceleyebilir ve satın alabilirsiniz. Çok yakında online satış ve adrese teslimat seçeneklerimizle hizmetinizde olacağız.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
