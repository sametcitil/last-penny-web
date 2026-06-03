"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Music, Flame, Mic2, BookOpen, Disc, Sliders, X } from "lucide-react";
import Container from "@/components/ui/Container";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  isFeatured?: boolean;
  image?: string;
  images?: string[];
  price?: number;
  location?: string;
}

const categoryConfig: Record<string, { gradient: string; glow: string; icon: any; label: string }> = {
  jazz: {
    gradient: "from-red-50 to-rose-100/50",
    glow: "border-[var(--color-primary)]/20",
    icon: Music,
    label: "Jazz Night",
  },
  rock: {
    gradient: "from-orange-50 to-amber-100/50",
    glow: "border-[var(--color-accent)]/20",
    icon: Flame,
    label: "Rock Live",
  },
  acoustic: {
    gradient: "from-stone-50 to-stone-100/50",
    glow: "border-[var(--color-secondary)]/20",
    icon: Mic2,
    label: "Akustik",
  },
  dj: {
    gradient: "from-rose-50 to-red-100/50",
    glow: "border-[var(--color-primary-light)]/20",
    icon: Disc,
    label: "DJ Set",
  },
  talk: {
    gradient: "from-neutral-50 to-neutral-100/50",
    glow: "border-[var(--color-border)]",
    icon: BookOpen,
    label: "Söyleşi / Kulüp",
  },
  other: {
    gradient: "from-zinc-50 to-zinc-100/50",
    glow: "border-[var(--color-border)]",
    icon: Calendar,
    label: "Etkinlik",
  },
};

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=event");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = activeCategory === "all" 
        ? "/api/events" 
        : `/api/events?category=${activeCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events);
      } else {
        setError("Etkinlikler yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedEvent]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
  };

  const TABS = [
    { id: "all", label: "Tüm Etkinlikler" },
    ...categories.map((c) => ({ id: c.slug, label: c.name })),
  ];

  const modalImages = selectedEvent
    ? selectedEvent.images && selectedEvent.images.length > 0
      ? selectedEvent.images
      : selectedEvent.image
      ? [selectedEvent.image]
      : []
    : [];

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[var(--color-bg)] text-[var(--color-secondary)]">
      {/* Banner */}
      <section className="relative py-16 overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 text-[var(--color-primary)] mb-3"
              >
                <Calendar size={16} />
                <span className="text-xs uppercase tracking-widest font-bold font-mono">Kültür ve Sahne</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-black font-[family-name:var(--font-playfair)] tracking-wide mb-4"
              >
                Last Penny Sahnesi
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-base text-[var(--color-secondary)]/60 leading-relaxed"
              >
                Haftalık jazz quartet konserleri, akustik performanslar, kitap kulüpleri ve söyleşilerle Ankara Kavaklıdere&apos;nin nabzını tutuyoruz.
              </motion.p>
            </div>
            
            {/* Visual stage header representation */}
            <div className="md:col-span-5 border-2 border-[var(--color-secondary)] p-1.5 bg-white shadow-md rotate-[1.5deg]">
              <img 
                src="/stage.jpg" 
                alt="Last Penny Stage" 
                className="w-full h-[180px] object-cover grayscale-10"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Filter Options (Mobile-friendly horizontal scroll) */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-bg)]/90 backdrop-blur-md py-6 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            <Sliders size={14} className="text-[var(--color-secondary)]/40 mr-2 shrink-0 hidden md:block" />
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative px-4 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 whitespace-nowrap cursor-pointer snap-start min-h-[38px] flex items-center justify-center ${
                  activeCategory === tab.id
                    ? "border-[var(--color-primary)] text-white bg-[var(--color-primary)] shadow-sm"
                    : "border-[var(--color-border)] text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]/30 bg-[var(--color-surface)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Events Listing */}
      <section className="py-12">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl animate-shimmer min-h-[350px] overflow-hidden">
                  <div className="h-40 bg-[var(--color-surface-hover)]" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-[var(--color-surface-hover)] w-1/3 rounded" />
                    <div className="h-6 bg-[var(--color-surface-hover)] w-3/4 rounded" />
                    <div className="h-3 bg-[var(--color-surface-hover)] w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/50 font-semibold">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-secondary)]/40 font-semibold">Yaklaşan etkinlik bulunamadı. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {events.map((e) => {
                  const cfg = categoryConfig[e.category] || categoryConfig.other;
                  const IconComponent = cfg.icon;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                      key={e._id}
                      onClick={() => setSelectedEvent(e)}
                      className="bg-[var(--color-surface)] flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[var(--color-secondary)] hover:shadow-md transition-all duration-300 group cursor-pointer"
                    >
                      {/* Banner Visual */}
                      <div className={`relative h-40 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center p-6 border-b border-[var(--color-border)] overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent)] pointer-events-none" />
                        
                        {/* Dynamic Background Icon for decoration */}
                        <IconComponent className="absolute -right-8 -bottom-8 w-32 h-32 text-[var(--color-primary)]/5 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />

                        {/* Centered Icon & Category Badge */}
                        <div className="flex flex-col items-center gap-2 z-10">
                          <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-xs">
                            <IconComponent size={22} className="group-hover:animate-bounce" />
                          </div>
                          <span className="text-[10px] tracking-[0.2em] font-mono text-[var(--color-secondary)]/50 font-bold uppercase mt-1">
                            {cfg.label}
                          </span>
                        </div>

                        {/* Featured Badge */}
                        {e.isFeatured && (
                          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-bold bg-[var(--color-primary)] text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            <Sparkles size={8} />
                            Öne Çıkan
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Date and Time */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-secondary)]/50 mb-3 font-mono">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-[var(--color-primary)]" />
                              <span className="font-semibold">{formatDate(e.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-[var(--color-primary)]" />
                              <span className="font-semibold">{e.time}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-[family-name:var(--font-playfair)] font-black text-xl text-[var(--color-secondary)] mb-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                            {e.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-[var(--color-secondary)]/60 leading-relaxed mb-6">
                            {e.description}
                          </p>
                        </div>

                        {/* Location / Reservation */}
                        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-secondary)]/50">
                          <span className="flex items-center gap-1 font-semibold truncate max-w-[65%]">
                            <MapPin size={12} className="text-[var(--color-primary)] shrink-0" />
                            {e.location || "LP Sahne"}
                          </span>
                          <span className="text-[var(--color-primary)] font-extrabold text-xs font-mono">
                            {e.price && e.price > 0 ? `₺${e.price}` : "Giriş Serbest"}
                          </span>
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

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[80vh]"
            >
              {/* Left Column: Carousel */}
              <div className="md:w-1/2 relative bg-stone-900 flex items-center justify-center min-h-[250px] md:min-h-full">
                {modalImages.length > 0 ? (
                  <>
                    <img
                      src={modalImages[currentImageIndex]}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover aspect-video md:aspect-auto md:absolute md:inset-0"
                    />
                    {modalImages.length > 1 && (
                      <>
                        {/* Back button */}
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full transition-all cursor-pointer z-10"
                        >
                          &lt;
                        </button>
                        {/* Next button */}
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full transition-all cursor-pointer z-10"
                        >
                          &gt;
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {modalImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentImageIndex === idx ? "bg-white scale-125" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-stone-500 flex flex-col items-center justify-center p-8 w-full">
                    <Music size={48} className="text-stone-600 mb-2" />
                    <span className="text-xs">Görsel Bulunmuyor</span>
                  </div>
                )}
              </div>

              {/* Right Column: Info */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
                <div className="space-y-4">
                  {/* Category tag & Close button */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] font-mono text-[var(--color-primary)] font-bold uppercase">
                      {(categoryConfig[selectedEvent.category] || categoryConfig.other).label}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-100 transition-all duration-300"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="font-[family-name:var(--font-playfair)] font-black text-2xl text-[var(--color-secondary)] leading-snug">
                    {selectedEvent.title}
                  </h2>

                  {/* Date & Time info block */}
                  <div className="flex flex-col gap-2 text-xs text-[var(--color-secondary)]/70 font-mono bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[var(--color-primary)] animate-pulse" />
                      <span className="font-semibold">{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[var(--color-primary)]" />
                      <span className="font-semibold">Saat: {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[var(--color-primary)]" />
                      <span className="font-semibold">Konum: {selectedEvent.location || "LP Kavaklıdere Sahne"}</span>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-muted)] font-semibold">Giriş Ücreti / Bilet:</span>
                    <span className="text-sm font-extrabold text-[var(--color-primary)] font-mono">
                      {selectedEvent.price && selectedEvent.price > 0 ? `₺${selectedEvent.price}` : "Giriş Serbest"}
                    </span>
                  </div>

                  {/* Extended details / description */}
                  <div className="text-sm text-zinc-600 leading-relaxed pr-1">
                    <p>{selectedEvent.description}</p>
                  </div>
                </div>

                {/* Reservation Warning */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="text-[11px] text-stone-500 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/50 leading-relaxed">
                    💡 <strong>Rezervasyon Bilgisi:</strong> Etkinlik günü kapıda yoğunluk yaşamamak için web sitemiz üzerinden ya da telefonla masa rezervasyonu yaptırmanız rica olunur.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
