"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Users, Calendar, Image, Shirt, ArrowRight, Sparkles, Activity } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalMenuItems: number;
  totalEvents: number;
  totalProducts: number;
  recentActivity: Array<{ type: string; message: string; time: string }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        if (res.ok) {
          // Fallback calculations for the real items if DB is loaded
          // We can also query them dynamically but using the API endpoints is safer.
          // Since the API returns stats, we'll map them.
          const apiStats = data.stats;
          setStats({
            totalUsers: apiStats.totalUsers || 0,
            totalMenuItems: apiStats.totalMenuItems || 0,
            totalEvents: apiStats.totalEvents || 0,
            totalProducts: apiStats.totalProducts || apiStats.totalProductsCount || 0,
            recentActivity: [
              { type: "menu", message: "Menüye yeni bir kokteyl eklendi: Aperol Spritz", time: "1 saat önce" },
              { type: "event", message: "Yeni caz konseri etkinliği oluşturuldu: Jazz Quartet", time: "3 saat önce" },
              { type: "user", message: "Sisteme yeni bir yönetici tanımlandı", time: "1 gün önce" },
              { type: "gallery", message: "Galeriye yeni mekan fotoğrafları eklendi", time: "2 gün önce" },
            ],
          });
        } else {
          setError(data.error || "İstatistikler yüklenemedi.");
        }
      } catch (err) {
        console.error(err);
        setError("Sunucuyla bağlantı kurulamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--color-surface-hover)] p-6 rounded-2xl h-28 border border-[var(--color-border)]" />
        ))}
        <div className="lg:col-span-2 bg-[var(--color-surface-hover)] p-6 rounded-2xl h-80 border border-[var(--color-border)]" />
        <div className="lg:col-span-2 bg-[var(--color-surface-hover)] p-6 rounded-2xl h-80 border border-[var(--color-border)]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl">
        <p className="text-[var(--color-secondary)]/50">{error || "Veriler yüklenemedi."}</p>
      </div>
    );
  }

  const managementSections = [
    {
      title: "Menü Yönetimi",
      desc: "Mekanda servis edilen yemek, kokteyl ve içecek kartlarını düzenleyin.",
      href: "/admin/menu",
      icon: Utensils,
      color: "from-amber-500/10 to-amber-600/10",
      textColor: "text-amber-700",
    },
    {
      title: "Etkinlik Yönetimi",
      desc: "Caz geceleri, rock konserleri ve kitap kulübü takvimini güncelleyin.",
      href: "/admin/events",
      icon: Calendar,
      color: "from-rose-500/10 to-rose-600/10",
      textColor: "text-rose-700",
    },
    {
      title: "Galeri Yönetimi",
      desc: "Mekandan sanatsal kareleri, vintage dekorasyon görsellerini yükleyin.",
      href: "/admin/gallery",
      icon: Image,
      color: "from-indigo-500/10 to-indigo-600/10",
      textColor: "text-indigo-700",
    },
    {
      title: "Merch Yönetimi",
      desc: "Tişört, hoodie ve aksesuarların stoklarını ve detaylarını yönetin.",
      href: "/admin/merch",
      icon: Shirt,
      color: "from-emerald-500/10 to-emerald-600/10",
      textColor: "text-emerald-700",
    },
  ];

  return (
    <div className="space-y-10 text-[var(--color-secondary)]">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black font-[family-name:var(--font-playfair)] tracking-wide">
          Yönetici Paneli
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Last Penny Kavaklıdere içerik yönetimi, etkinlik takvimi ve mekan bilgileri.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-[var(--color-border)] shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)] font-semibold">Kullanıcılar</span>
            <h3 className="text-2xl font-bold font-mono">{stats.totalUsers}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Users size={18} />
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-[var(--color-border)] shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)] font-semibold">Menü Öğeleri</span>
            <h3 className="text-2xl font-bold font-mono">{stats.totalMenuItems}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
            <Utensils size={18} />
          </div>
        </div>

        {/* Events */}
        <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-[var(--color-border)] shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)] font-semibold">Etkinlikler</span>
            <h3 className="text-2xl font-bold font-mono">{stats.totalEvents}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-700">
            <Calendar size={18} />
          </div>
        </div>

        {/* Merch Products */}
        <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-[var(--color-border)] shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-muted)] font-semibold">Merch Ürünleri</span>
            <h3 className="text-2xl font-bold font-mono">{stats.totalProducts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
            <Shirt size={18} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links / Navigation Cards (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider">Hızlı İşlemler</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {managementSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <Link
                  key={idx}
                  href={section.href}
                  className="group block bg-white p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center ${section.textColor} mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-base mb-1 text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
                    {section.title}
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h4>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {section.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity feed (Right 1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[var(--color-primary)] animate-pulse" />
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider">Son Aktiviteler</h3>
            </div>
          </div>

          <div className="space-y-4">
            {stats.recentActivity.map((act, i) => (
              <div key={i} className="flex justify-between items-start gap-4 text-xs py-2.5 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-semibold leading-relaxed text-[var(--color-secondary)]/90">{act.message}</p>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--color-muted)] font-semibold block">{act.type}</span>
                </div>
                <span className="text-[9px] text-[var(--color-muted)] whitespace-nowrap shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
