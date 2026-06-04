import Container from "@/components/ui/Container";
import { MapPin, Phone, Clock, Music } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20 bg-[var(--color-surface-hover)]">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-[var(--color-secondary)]">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Last Penny Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-lg tracking-[0.2em] font-black text-[var(--color-primary)]">
                LAST PENNY
              </span>
            </div>
            <p className="text-sm text-[var(--color-secondary)]/60 leading-relaxed">
              Jazz, kültür ve topluluk. Ankara&apos;nın kalbinde bir buluşma
              noktası.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Music size={14} className="text-[var(--color-accent)]" />
              <span className="text-xs font-semibold text-[var(--color-accent)]">
                Jazz • Culture • Community
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-secondary)]/40 mb-4 font-bold">
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
                  className="text-sm text-[var(--color-secondary)]/60 hover:text-[var(--color-primary)] font-semibold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-secondary)]/40 mb-4 font-bold">
              İletişim
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-[var(--color-secondary)]/60">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                <span>
                  Kavaklıdere, Büklüm Cd No:41/A,
                  <br />
                  06660 Çankaya/Ankara
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-secondary)]/60">
                <Phone size={16} className="shrink-0 text-[var(--color-primary)]" />
                <span>(0312) 926 07 21</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-secondary)]/60">
                <Clock size={16} className="shrink-0 text-[var(--color-primary)]" />
                <span>Her gün · 10:00 - 01:00</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-secondary)]/40 mb-4 font-bold">
              Çalışma Saatleri
            </h4>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-secondary)]/60">
              <div className="flex justify-between">
                <span>Her gün</span>
                <span className="text-[var(--color-secondary)]/80 font-semibold">10:00 - 01:00</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--color-border)] text-[var(--color-primary)] text-xs font-semibold">
                ☕ Hafta sonu kahvaltı: 10:00 - 15:00
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-secondary)]/40">
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