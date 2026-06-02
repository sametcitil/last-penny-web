"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const navLinks = [
  { href: "/menu", label: "Menü" },
  { href: "/events", label: "Etkinlikler" },
  { href: "/gallery", label: "Galeri" },
  { href: "/merch", label: "Merch" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong py-3 border-b border-[var(--color-border)]"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              className="relative w-9 h-9 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/logo.png"
                alt="Last Penny Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="font-[family-name:var(--font-playfair)] text-base tracking-[0.2em] font-black text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">
              LAST PENNY
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-semibold text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
 
          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Auth */}
            {user && (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors font-semibold"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm font-semibold text-[var(--color-secondary)]/80">{user.name}</span>
                <button
                  onClick={logout}
                  className="p-2 text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] transition-colors"
                  title="Çıkış yap"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
 
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] transition-colors"
            id="mobile-menu-button"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-b border-[var(--color-border)] overflow-hidden"
          >
            <Container>
              <nav className="flex flex-col py-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-semibold text-[var(--color-secondary)]/85 hover:text-[var(--color-primary)] transition-colors py-2.5 border-b border-[var(--color-border)]"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <div className="flex items-center gap-6 pt-4">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <LogOut size={18} />
                      Çıkış ({user.name})
                    </button>
                  </div>
                )}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
