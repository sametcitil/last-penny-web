"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Edit2, Check, RefreshCw } from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const statusLabels = {
  pending: { label: "Beklemede", badgeClass: "badge-pending" },
  confirmed: { label: "Onaylandı", badgeClass: "badge-confirmed" },
  shipped: { label: "Kargoda", badgeClass: "badge-shipped" },
  delivered: { label: "Teslim Edildi", badgeClass: "badge-delivered" },
  cancelled: { label: "İptal Edildi", badgeClass: "badge-cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        setError(data.error || "Siparişler yüklenemedi.");
      }
    } catch (err) {
      console.error(err);
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus as Order["status"] } : null);
        }
      } else {
        alert(data.error || "Sipariş güncellenemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Durum güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white tracking-wide">
            Sipariş Yönetimi
          </h1>
          <p className="text-xs text-white/50 mt-1">Gelen siparişlerin takibi ve teslimat durumlarının güncellenmesi.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/5 rounded-xl hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Yenile
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-2xl h-24 bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/50">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl space-y-2">
          <ShoppingCart size={40} className="text-white/20 mx-auto" />
          <p className="text-white/40">Kayıtlı herhangi bir sipariş bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto glass rounded-2xl border border-white/5">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Tarih</th>
                <th>Toplam Tutar</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="transition-colors">
                  <td className="font-mono text-xs text-white/80 font-bold">#{o._id}</td>
                  <td>
                    <div className="space-y-0.5">
                      <span className="font-medium text-white/80 block text-xs">{o.userName}</span>
                      <span className="text-[10px] text-white/30 block font-mono">ID: {o.userId}</span>
                    </div>
                  </td>
                  <td className="text-white/60 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="font-mono text-sm text-[var(--color-accent)] font-bold">₺{o.totalPrice}</td>
                  <td>
                    <span className={`badge ${statusLabels[o.status]?.badgeClass || "badge-pending"}`}>
                      {statusLabels[o.status]?.label || o.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 text-white/50 hover:text-[var(--color-accent)] hover:bg-white/5 rounded transition-colors"
                        title="Detayları Görüntüle"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Dropdown status changer */}
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        disabled={updatingId === o._id}
                        className="bg-[var(--color-bg)] text-xs border border-white/5 rounded px-2.5 py-1 text-white/80 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                      >
                        <option value="pending">Beklemede</option>
                        <option value="confirmed">Onaylandı</option>
                        <option value="shipped">Kargoda</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal Et</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Lightbox Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 p-6 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">Sipariş Detayı</h3>
                  <span className="font-mono text-xs text-white/40">Sipariş No: #{selectedOrder._id}</span>
                </div>
                <span className={`badge ${statusLabels[selectedOrder.status]?.badgeClass || "badge-pending"}`}>
                  {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>

              {/* Customer and date details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/40 block mb-0.5">Müşteri E-Posta</span>
                  <span className="text-white/85 font-medium">{selectedOrder.userName}</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-0.5">Sipariş Tarihi</span>
                  <span className="text-white/85 font-medium">{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40 font-mono block">Satın Alınan Ürünler</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-black/20 border border-white/5 p-3 rounded-lg flex justify-between items-center"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white/90">{item.name}</h4>
                        <span className="text-[10px] text-white/40 font-mono">Beden: {item.size} • Adet: {item.quantity}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--color-accent)]">₺{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary and Change Status */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Toplam Ciro:</span>
                  <span className="font-mono font-bold text-lg text-[var(--color-accent)]">₺{selectedOrder.totalPrice}</span>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Kapat
                  </button>
                  {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder._id, "delivered")}
                      className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-secondary)] font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      Teslim Edildi İşaretle
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
