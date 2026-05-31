import Container from "@/components/ui/Container";
import { MapPin, Phone, Clock, Music } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20 bg-[var(--color-surface)]">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-xs font-bold">
                LP
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-lg tracking-[0.2em] font-semibold">
                LAST PENNY
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Jazz, kültür ve topluluk. Ankara&apos;nın kalbinde bir buluşma
              noktası.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Music size={14} className="text-[var(--color-accent)]" />
              <span className="text-xs text-[var(--color-accent)]">
                Jazz • Culture • Community
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-semibold">
              Keşfet
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/menu", label: "Menü" },
                { href: "/events", label: "Etkinlikler" },
                { href: "/gallery", label: "Galeri" },
                { href: "/merch", label: "Merch" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-[var(--color-secondary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-semibold">
              İletişim
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-white/50">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                <span>
                  Kavaklıdere, Büklüm Cd No:41/A,
                  <br />
                  06660 Çankaya/Ankara
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone size={16} className="shrink-0 text-[var(--color-primary)]" />
                <span>(0312) 926 07 21</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Clock size={16} className="shrink-0 text-[var(--color-primary)]" />
                <span>Her gün · Kapanış 01:00</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-semibold">
              Çalışma Saatleri
            </h4>
            <div className="flex flex-col gap-2 text-sm text-white/50">
              <div className="flex justify-between">
                <span>Pazartesi - Perşembe</span>
                <span className="text-white/70">12:00 - 01:00</span>
              </div>
              <div className="flex justify-between">
                <span>Cuma - Cumartesi</span>
                <span className="text-white/70">12:00 - 02:00</span>
              </div>
              <div className="flex justify-between">
                <span>Pazar</span>
                <span className="text-white/70">10:00 - 01:00</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 text-[var(--color-accent)] text-xs">
                ☕ Hafta sonu kahvaltı: 10:00 - 15:00
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2026 Last Penny. Tüm hakları saklıdır.</p>
          <p>
            Made with{" "}
            <span className="text-[var(--color-primary)]">♥</span> in Ankara
          </p>
        </div>
      </Container>
    </footer>
  );
}