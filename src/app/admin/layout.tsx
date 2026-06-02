"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Utensils, Calendar, Image, Shirt, Home, LogOut } from "lucide-react";
import Container from "@/components/ui/Container";

const sidebarLinks = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menü Yönetimi", icon: Utensils },
  { href: "/admin/events", label: "Etkinlikler", icon: Calendar },
  { href: "/admin/gallery", label: "Galeri Yönetimi", icon: Image },
  { href: "/admin/merch", label: "Merch Yönetimi", icon: Shirt },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login?redirect=/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">Yetkisiz Erişim</h2>
          <p className="text-sm text-white/50">Bu sayfayı görüntülemek için yönetici yetkilerine sahip olmanız gerekir.</p>
          <Link href="/" className="inline-block text-xs text-[var(--color-accent)] underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] md:fixed md:top-20 md:bottom-0 md:left-0 z-30">
        <div className="p-6 flex flex-col justify-between h-full space-y-8">
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-muted)] font-semibold block px-3">
              Yönetici Paneli
            </span>
            <nav className="flex flex-col gap-1.5">
              {sidebarLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 font-semibold"
                  >
                    <IconComponent size={16} className="text-[var(--color-accent)]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-[var(--color-border)] flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-xs text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] transition-colors font-semibold"
            >
              <Home size={14} />
              <span>Siteyi Görüntüle</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="flex items-center gap-3 px-3 py-2 text-xs text-red-600/70 hover:text-red-600 transition-colors w-full text-left cursor-pointer font-semibold"
            >
              <LogOut size={14} />
              <span>Oturumu Kapat</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 md:pl-64">
        <main className="p-6 md:p-10">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
