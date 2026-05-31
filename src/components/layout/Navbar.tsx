"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
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
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-xs font-bold"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              LP
            </motion.div>
            <span className="font-[family-name:var(--font-playfair)] text-lg tracking-[0.2em] font-semibold group-hover:text-[var(--color-accent)] transition-colors">
              LAST PENNY
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-white/70 hover:text-[var(--color-secondary)] transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-white/70 hover:text-[var(--color-secondary)] transition-colors"
              id="cart-button"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] rounded-full text-[10px] font-bold flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-white/60">{user.name}</span>
                <button
                  onClick={logout}
                  className="p-2 text-white/50 hover:text-[var(--color-primary)] transition-colors"
                  title="Çıkış yap"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 transition-all duration-300"
              >
                <User size={16} />
                Giriş
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/70"
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
            className="md:hidden glass-strong overflow-hidden"
          >
            <Container>
              <nav className="flex flex-col py-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg text-white/80 hover:text-[var(--color-secondary)] transition-colors py-2 border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      toggleCart();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <ShoppingBag size={18} />
                    Sepet {totalItems > 0 && `(${totalItems})`}
                  </button>
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm text-white/70"
                    >
                      <LogOut size={18} />
                      Çıkış
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm text-white/70"
                    >
                      <User size={18} />
                      Giriş
                    </Link>
                  )}
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}