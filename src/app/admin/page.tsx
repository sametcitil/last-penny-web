"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Calendar, Sparkles, DollarSign, Activity } from "lucide-react";

interface RevenueMonth {
  month: string;
  revenue: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface PopularItem {
  name: string;
  orders: number;
}

interface RecentActivity {
  type: string;
  message: string;
  time: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalMenuItems: number;
  totalEvents: number;
  totalProducts: number;
  revenueByMonth: RevenueMonth[];
  ordersByStatus: OrderStatus[];
  popularItems: PopularItem[];
  recentActivity: RecentActivity[];
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
          setStats(data.stats);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-2xl h-28 bg-white/5" />
        ))}
        <div className="md:col-span-2 glass p-6 rounded-2xl h-80 bg-white/5" />
        <div className="md:col-span-2 glass p-6 rounded-2xl h-80 bg-white/5" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
        <p className="text-white/50">{error || "Veriler yüklenemedi."}</p>
      </div>
    );
  }

  // Max value calculation for bar percentage sizing
  const maxRevenue = Math.max(...stats.revenueByMonth.map((r) => r.revenue));
  const maxPopularOrders = Math.max(...stats.popularItems.map((p) => p.orders));

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white tracking-wide">
          Yönetim Paneli
        </h1>
        <p className="text-xs text-white/50 mt-1">Mekan performansı, sipariş durumları ve son aktiviteler.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">Toplam Ciro</span>
            <h3 className="text-2xl font-bold text-[var(--color-accent)] font-mono">₺{stats.totalRevenue}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
            <DollarSign size={18} />
          </div>
        </div>

        {/* Orders */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">Siparişler</span>
            <h3 className="text-2xl font-bold text-white font-mono">{stats.totalOrders}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <ShoppingBag size={18} />
          </div>
        </div>

        {/* Users */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">Kullanıcılar</span>
            <h3 className="text-2xl font-bold text-white font-mono">{stats.totalUsers}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users size={18} />
          </div>
        </div>

        {/* Products count */}
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">Aktif Menü/Merch</span>
            <h3 className="text-2xl font-bold text-white font-mono">{stats.totalMenuItems + stats.totalProducts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* Grid: Charts & Statistics details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue chart (Custom stylized bars) */}
        <div className="glass p-6 rounded-2xl border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/90 uppercase font-mono tracking-wider">Aylık Gelir Analizi</h3>
            <DollarSign size={14} className="text-white/30" />
          </div>

          <div className="flex items-end justify-between h-48 pt-4 gap-2">
            {stats.revenueByMonth.map((r, i) => {
              const heightPercent = maxRevenue > 0 ? (r.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative bg-white/5 rounded-t-lg h-36 overflow-hidden flex flex-col justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-accent)] rounded-t-lg group-hover:brightness-110 transition-all"
                    />
                    {/* Tooltip value */}
                    <div className="opacity-0 group-hover:opacity-100 absolute top-1 left-1/2 -translate-x-1/2 bg-black/80 text-[9px] text-[var(--color-accent)] font-bold px-1 rounded transition-opacity pointer-events-none font-mono">
                      ₺{r.revenue}
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold font-mono">{r.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular products list */}
        <div className="glass p-6 rounded-2xl border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/90 uppercase font-mono tracking-wider">En Çok Satan Merch Ürünleri</h3>
            <Sparkles size={14} className="text-[var(--color-accent)]" />
          </div>

          <div className="space-y-4 pt-2">
            {stats.popularItems.map((item, i) => {
              const percent = maxPopularOrders > 0 ? (item.orders / maxPopularOrders) * 100 : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/80">{item.name}</span>
                    <span className="font-mono text-[var(--color-accent)] font-semibold">{item.orders} sipariş</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-[var(--color-accent)] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Order Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <div className="glass p-6 rounded-2xl border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/90 uppercase font-mono tracking-wider">Sipariş Durumları</h3>
            <ShoppingBag size={14} className="text-white/30" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.ordersByStatus.map((status, i) => (
              <div key={i} className="bg-black/20 p-4 border border-white/5 rounded-xl text-center space-y-1">
                <span className="text-[10px] text-white/40 block font-medium">{status.status}</span>
                <span className="text-2xl font-bold font-mono text-white/90">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass p-6 rounded-2xl border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/90 uppercase font-mono tracking-wider">Son Aktiviteler</h3>
            <Activity size={14} className="text-white/30 animate-pulse" />
          </div>

          <div className="space-y-4">
            {stats.recentActivity.map((act, i) => (
              <div key={i} className="flex justify-between items-start gap-4 text-xs py-2.5 border-b border-white/5 last:border-b-0">
                <div className="space-y-0.5">
                  <p className="text-white/80 leading-relaxed font-medium">{act.message}</p>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-white/30 block">{act.type}</span>
                </div>
                <span className="text-[9px] text-white/40 whitespace-nowrap shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
