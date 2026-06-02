"use client";

import { motion } from "framer-motion";
import { Music, Calendar, ChevronRight, Sparkles, MessageSquare, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { mockEvents, mockMenuItems } from "@/lib/mock-data";

const eventCategories = {
  jazz: "border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] bg-[var(--color-surface)] shadow-xs",
  rock: "border-[var(--color-primary-light)]/30 hover:border-[var(--color-primary-light)] bg-[var(--color-surface)] shadow-xs",
  acoustic: "border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs",
  dj: "border-[var(--color-primary-light)]/20 hover:border-[var(--color-primary-light)] bg-[var(--color-surface)] shadow-xs",
  talk: "border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/30 bg-[var(--color-surface)] shadow-xs",
  other: "border-[var(--color-border)] hover:border-[var(--color-secondary)] bg-[var(--color-surface)] shadow-xs",
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
    <main className="min-h-screen bg-[var(--color-bg)] overflow-hidden text-[var(--color-secondary)]">
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 border-b border-[var(--color-border)] bg-[radial-gradient(circle_at_center,rgba(156,26,28,0.03)_0%,transparent_70%)]">
        
        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (Text & Actions) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-7 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Tagline */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold text-[10px] tracking-[0.2em] uppercase"
              >
                <Music size={10} className="animate-pulse" />
                <span>Jazz • Kültür • Mahalle</span>
              </motion.div>

              {/* Title & Skater Logo */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <img 
                    src="/logo.png" 
                    alt="Last Penny Skater Logo" 
                    className="w-20 h-20 md:w-24 md:h-24 object-contain animate-float"
                  />
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-[family-name:var(--font-playfair)] tracking-wide leading-tight text-[var(--color-secondary)]">
                    Worth Every <br />
                    <span className="text-[var(--color-primary)] font-black">Last Penny</span>
                  </h1>
                </div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-[var(--color-secondary)]/70 leading-relaxed max-w-xl"
              >
                Ankara Kavaklıdere&apos;nin kalbinde; nitelikli canlı caz melodileri, 
                özenle hazırlanan el yapımı kokteyller ve kitap kokulu samimi bir mahalle topluluğunun buluşma noktası.
              </motion.p>

              {/* Action buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start w-full"
              >
                <Link
                  href="/menu"
                  className="px-6 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:scale-105 min-h-[44px]"
                >
                  Menüyü İncele
                  <ChevronRight size={14} />
                </Link>
                <Link
                  href="/events"
                  className="px-6 py-4 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-105 min-h-[44px]"
                >
                  Etkinlikler
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Collage (Spirit of the Venue) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5 relative h-[350px] sm:h-[450px] w-full"
            >
              {/* Main Exterior Photo Frame */}
              <div className="absolute top-4 left-4 w-4/5 h-4/5 border-2 border-[var(--color-secondary)] p-2 bg-white rotate-[-2deg] shadow-lg overflow-hidden group">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="/sign.png" 
                    alt="Last Penny Outside Sign" 
                    className="w-full h-full object-cover grayscale-20 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white text-[9px] uppercase tracking-widest font-mono font-bold px-2 py-0.5">
                    Büklüm Sokak
                  </div>
                </div>
              </div>

              {/* Smaller Interior Overlay Frame */}
              <div className="absolute bottom-4 right-4 w-3/5 h-3/5 border-2 border-[var(--color-secondary)] p-1.5 bg-white rotate-[3deg] shadow-xl overflow-hidden group z-10">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="/interior.jpg" 
                    alt="Last Penny Library Interior" 
                    className="w-full h-full object-cover grayscale-20 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-2 right-2 bg-[var(--color-accent)] text-white text-[9px] uppercase tracking-widest font-mono font-bold px-2 py-0.5">
                    Kütüphane
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── EVENTS PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 border-b border-[var(--color-border)] relative">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] font-bold font-mono">Caz & Canlı Müzik</span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mt-1 text-[var(--color-secondary)]">
                Bu Hafta Sahne
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-bold group"
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
                className={`p-6 rounded-2xl border ${
                  eventCategories[e.category] || eventCategories.other
                } hover:shadow-md transition-all duration-500 flex flex-col justify-between h-[240px] group border-2 border-[var(--color-secondary)]`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-[var(--color-primary)] font-bold">{e.time} • {new Date(e.date).toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {e.title}
                  </h3>
                  <p className="text-xs text-[var(--color-secondary)]/60 mt-2 line-clamp-3 leading-relaxed">
                    {e.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center text-[10px] text-[var(--color-secondary)]/40 font-mono uppercase tracking-wider">
                  <span>Giriş Serbest</span>
                  <span className="text-[var(--color-primary)] font-bold">Sahne Alıyor</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PATIO BANNER BREAK ────────────────────────────────────────── */}
      <section className="py-20 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 border-2 border-[var(--color-secondary)] p-2 bg-white shadow-md">
              <img 
                src="/patio.png" 
                alt="Last Penny Patio Garden" 
                className="w-full h-[280px] object-cover grayscale-10"
              />
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-wider font-bold">Açık Hava & Bahçe</span>
              <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide">
                Asmaların Altında Sakin Bir Akşam
              </h3>
              <p className="text-sm text-[var(--color-secondary)]/70 leading-relaxed">
                Mekanın arka bahçesinde yer alan tuğla duvarlar ve yemyeşil asma yapraklarının gölgesinde, şehrin gürültüsünden uzak, taze craft biranızı yudumlayabilirsiniz. Yaz akşamları için en serin Kavaklıdere sığınağınız.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MENU HIGHLIGHTS ──────────────────────────────────────────── */}
      <section className="py-24 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold font-mono">Öne Çıkan Lezzetler</span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mt-1 text-[var(--color-secondary)]">
                Favorilerimiz
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-bold group"
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
                className="bg-[var(--color-surface)] p-6 rounded-2xl flex flex-col justify-between h-[200px] border border-[var(--color-border)] shadow-xs hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-300 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-[var(--color-primary)] before:rounded-t-2xl"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-base text-[var(--color-secondary)]/90">
                      {m.name}
                    </h3>
                    <span className="flex items-center gap-1 text-[8px] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      <Sparkles size={8} />
                      Favori
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-secondary)]/60 line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--color-border)]/50">
                  <span className="text-[10px] text-[var(--color-secondary)]/40 uppercase tracking-widest font-mono font-bold">{m.category}</span>
                  <span className="font-bold text-[var(--color-primary)] font-mono text-base">₺{m.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── AI CHATBOT TEASER ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(156,26,28,0.02)_0%,transparent_70%)]">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-lg"
          >
            {/* Visual glow */}
            <div className="absolute -left-20 -top-20 w-48 h-48 bg-[var(--color-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-xl z-10">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <MessageSquare size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Akıllı Menü Asistanı</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide text-[var(--color-secondary)] leading-tight">
                Ne İçmek İstersin? Asistanımıza Danış!
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-secondary)]/60 leading-relaxed">
                Google Gemini destekli yapay zekâ asistanımız, damak zevkine en uygun kokteylleri ve yemek eşleşmelerini önermek için seni bekliyor.
              </p>
            </div>

            <div className="shrink-0 z-10 text-center md:text-right">
              <span className="text-[10px] text-[var(--color-secondary)]/40 block mb-3 font-mono font-semibold">
                Sohbeti başlatmak için sağ alttaki balona tıkla!
              </span>
              <div className="inline-flex gap-2 flex-wrap justify-center md:justify-end">
                <span className="px-3 py-1.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[10px] text-[var(--color-primary)] font-mono font-bold">
                  🍷 Tatlı & Ekşi Kokteyl
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[10px] text-[var(--color-secondary)]/50 font-mono">
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