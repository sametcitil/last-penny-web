"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";


function RegisterFormContent() {
  const { user, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurunuz.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await register(name, email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(redirect);
      }
    } catch {
      setError("Bir bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 flex items-center bg-[var(--color-bg)]">
      <Container className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong card-glow w-full max-w-md p-8 md:p-10 rounded-3xl relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute -left-24 -top-24 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-[var(--color-accent)]/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Title */}
          <div className="text-center mb-8 relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--color-primary)]/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] tracking-wide mb-2 text-white">
              Kaydol
            </h1>
            <p className="text-xs text-white/50">
              Last Penny topluluğuna katıl ve ilk siparişine özel ayrıcalıklardan yararlan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5 relative">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3.5 rounded-xl text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-[var(--color-bg)] rounded-xl pl-12 pr-4 py-3 text-sm border border-white/5 text-white/95 placeholder-white/20 transition-all focus:border-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmet@example.com"
                  className="w-full bg-[var(--color-bg)] rounded-xl pl-12 pr-4 py-3 text-sm border border-white/5 text-white/95 placeholder-white/20 transition-all focus:border-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-[var(--color-bg)] rounded-xl pl-12 pr-4 py-3 text-sm border border-white/5 text-white/95 placeholder-white/20 transition-all focus:border-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40 block">
                Şifre Tekrarı
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifreyi onaylayın"
                  className="w-full bg-[var(--color-bg)] rounded-xl pl-12 pr-4 py-3 text-sm border border-white/5 text-white/95 placeholder-white/20 transition-all focus:border-[var(--color-primary)]"
                  required
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-secondary)] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Hesap Oluştur
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Redirect to login */}
          <div className="text-center mt-8 text-xs text-white/40 relative">
            Zaten hesabın var mı?{" "}
            <Link
              href={`/auth/login?redirect=${redirect}`}
              className="text-[var(--color-accent)] hover:underline font-semibold"
            >
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
        </div>
      </main>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}

