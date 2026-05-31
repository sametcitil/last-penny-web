"use client";

import { motion } from "framer-motion";
import { Music, Calendar, ChevronRight, Sparkles, MessageSquare, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { mockEvents, mockMenuItems } from "@/lib/mock-data";

const eventCategories = {
  jazz: "from-indigo-950/70 to-blue-900/70 border-indigo-500/20",
  rock: "from-red-950/70 to-rose-900/70 border-rose-500/20",
  acoustic: "from-amber-950/70 to-orange-900/70 border-amber-500/20",
  dj: "from-purple-950/70 to-fuchsia-900/70 border-purple-500/20",
  talk: "from-teal-950/70 to-emerald-900/70 border-teal-500/20",
  other: "from-zinc-900/70 to-zinc-800/70 border-zinc-500/20",
};

export default function HomePage() {
  const featuredEvents = mockEvents.filter((e) => e.isFeatured).slice(0, 3);
  const featuredMenu = mockMenuItems.filter((m) => m.isFeatured).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  } as const;


  return (
    <main className="min-h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-20 border-b border-white/5 bg-[radial-gradient(circle_at_center,rgba(212,56,42,0.07)_0%,transparent_60%)]">
        {/* Abstract decorative floating lights */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full filter blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full filter blur-[120px] animate-float pointer-events-none [animation-delay:2s]" />

        <Container className="relative z-10 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl space-y-6"
          >
            {/* Tagline */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[var(--color-accent)] font-semibold text-[10px] tracking-[0.2em] uppercase"
            >
              <Music size={10} className="animate-pulse" />
              <span>Jazz • Culture • Community</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-playfair)] tracking-wide leading-[1.1] text-white"
            >
              Worth Every <br />
              <span className="gradient-text">Last Penny</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-white/60 leading-relaxed max-w-xl"
            >
              Ankara Kavaklıdere&apos;nin kalbinde; nitelikli canlı caz melodileri, 
              özenle demlenmiş kokteyller ve samimi bir mahalle topluluğunun buluşma noktası.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href="/menu"
                className="px-6 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-secondary)] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105"
              >
                Menüyü İncele
                <ChevronRight size={14} />
              </Link>
              <Link
                href="/events"
                className="px-6 py-3.5 border border-white/10 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 text-white hover:text-[var(--color-accent)] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                Etkinlikler
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── EVENTS PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/5 relative">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary-light)] font-bold font-mono">Caz & Canlı Müzik</span>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mt-1 text-white">
                Bu Hafta Sahne
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 font-semibold group"
            >
              Tüm Programı Gör
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((e, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={e._id}
                className={`glass p-6 rounded-2xl border ${
                  eventCategories[e.category] || eventCategories.other
                } hover:shadow-lg hover:shadow-black/40 transition-all duration-500 flex flex-col justify-between h-[230px] group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-white/40">{e.time} • {new Date(e.date).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white/90 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {e.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-2 line-clamp-3 leading-relaxed">
                    {e.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono uppercase tracking-wider">
                  <span>Giriş Serbest</span>
                  <span className="text-[var(--color-accent)]">Programda</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── MENU HIGHLIGHTS ──────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/5 bg-black/10">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold font-mono">Öne Çıkan Lezzetler</span>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mt-1 text-white">
                Favorilerimiz
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 font-semibold group"
            >
              Tam Menüyü Aç
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMenu.map((m, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={m._id}
                className="glass card-glow p-6 rounded-2xl flex flex-col justify-between h-[180px] hover:bg-[var(--color-surface-hover)]/30 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-semibold text-base text-white/90">
                      {m.name}
                    </h3>
                    <span className="flex items-center gap-1 text-[8px] bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/20 text-[var(--color-accent)] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      <Sparkles size={8} />
                      Favori
                    </span>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{m.category}</span>
                  <span className="font-bold text-[var(--color-accent)] font-mono">₺{m.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── AI CHATBOT TEASER ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.04)_0%,transparent_60%)]">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong border border-[var(--color-primary)]/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* Visual glow */}
            <div className="absolute -left-20 -top-20 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-xl z-10">
              <div className="flex items-center gap-2 text-[var(--color-accent)]">
                <MessageSquare size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Akıllı Menü Asistanı</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide text-white leading-tight">
                Ne İçmek İstersin? Asistanımıza Danış!
              </h3>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                Google Gemini destekli yapay zekâ asistanımız, damak zevkine en uygun kokteylleri ve yemek eşleşmelerini önermek için seni bekliyor.
              </p>
            </div>

            <div className="shrink-0 z-10 text-center md:text-right">
              <span className="text-[10px] text-white/40 block mb-3 font-mono">
                Sohbeti başlatmak için sağ alttaki balona tıkla!
              </span>
              <div className="inline-flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-[var(--color-accent)] font-mono font-semibold">
                  🍷 Tatlı & Ekşi Kokteyl
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50 font-mono">
                  🍕 Ne Yiyebilirim?
                </span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}