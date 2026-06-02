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
  category: "jazz" | "rock" | "acoustic" | "dj" | "talk" | "other";
  isFeatured?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "Tüm Etkinlikler" },
  { id: "jazz", label: "Jazz Geceleri" },
  { id: "rock", label: "Rock / Alternatif" },
  { id: "acoustic", label: "Akustik Dinletiler" },
  { id: "dj", label: "DJ Setleri" },
  { id: "talk", label: "Söyleşi / Kültür" },
];

const categoryConfig = {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
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

    fetchEvents();
  }, [activeCategory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
  };

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
                          <span className="flex items-center gap-1 font-semibold">
                            <MapPin size={12} className="text-[var(--color-primary)]" />
                            LP Sahne
                          </span>
                          <span className="text-[var(--color-primary)] font-bold text-[10px] uppercase tracking-wider">
                            Giriş Serbest
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
              className="bg-white w-full max-w-lg rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl flex flex-col relative"
            >
              {/* Top category decoration */}
              <div className={`h-24 bg-gradient-to-br ${(categoryConfig[selectedEvent.category] || categoryConfig.other).gradient} flex items-center p-6 border-b border-[var(--color-border)] relative`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-xs">
                    {(() => {
                      const Icon = (categoryConfig[selectedEvent.category] || categoryConfig.other).icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] font-mono text-[var(--color-secondary)]/50 font-bold uppercase block">
                      {(categoryConfig[selectedEvent.category] || categoryConfig.other).label}
                    </span>
                    <span className="text-xs text-[var(--color-primary)] font-bold">Last Penny Sahnesi</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-100/80 transition-all duration-300"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  {/* Date & Time info block */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-secondary)]/50 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[var(--color-primary)]" />
                      <span className="font-semibold">{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[var(--color-primary)]" />
                      <span className="font-semibold">{selectedEvent.time}</span>
                    </div>
                  </div>

                  <h2 className="font-[family-name:var(--font-playfair)] font-black text-2xl text-[var(--color-secondary)] leading-snug">
                    {selectedEvent.title}
                  </h2>
                </div>

                {/* Extended details / description */}
                <div className="text-sm text-zinc-600 leading-relaxed space-y-4">
                  <p>{selectedEvent.description}</p>
                  <p className="text-xs text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100">
                    💡 <strong>Masa Rezervasyonu:</strong> Etkinliklerimiz ücretsiz olup, giriş serbesttir. Sahneye yakın masalar için önceden rezervasyon yaptırmanız önerilir. Rezervasyon yaptırmak için web sitemiz üzerindeki rezervasyon panelini kullanabilir veya doğrudan bizimle iletişime geçebilirsiniz.
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-secondary)]/50">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin size={12} className="text-[var(--color-primary)]" />
                    LP Kavaklıdere Sahne
                  </span>
                  <span className="text-[var(--color-primary)] font-bold text-[10px] uppercase tracking-wider">
                    Giriş Serbest
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
