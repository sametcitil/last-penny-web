"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Utensils } from "lucide-react";

interface MenuItemType {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "yemek" | "kokteyl" | "icecek" | "kahvalti" | "tatli";
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

const CATEGORIES = [
  { id: "all", label: "Tüm Kategoriler" },
  { id: "yemek", label: "Yemekler" },
  { id: "kokteyl", label: "Kokteyller" },
  { id: "icecek", label: "İçecekler" },
  { id: "kahvalti", label: "Kahvaltı" },
  { id: "tatli", label: "Tatlılar" },
];

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<MenuItemType["category"]>("yemek");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
      } else {
        setError(data.error || "Menü öğeleri yüklenemedi.");
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setDescription("");
    setPrice(0);
    setCategory("yemek");
    setIsAvailable(true);
    setIsFeatured(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItemType) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setIsAvailable(item.isAvailable);
    setIsFeatured(item.isFeatured);
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) {
      setFormError("Lütfen geçerli ad ve fiyat giriniz.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const body = { name, description, price, category, isAvailable, isFeatured };

      const url = editingItem ? `/api/menu/${editingItem._id}` : "/api/menu";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchItems();
      } else {
        setFormError(data.error || "İşlem başarısız oldu.");
      }
    } catch {
      setFormError("Sunucu hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      alert("Sunucu hatası.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 text-[var(--color-secondary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-playfair)] tracking-wide">
            Menü Yönetimi
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Yemek, içecek ve tatlı listelerini düzenleyin.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchItems}
            className="p-2.5 bg-white border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Yenile
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[var(--color-primary)]/10"
          >
            <Plus size={14} />
            Yeni Öğe Ekle
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            placeholder="Menü öğelerinde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] text-sm placeholder-[var(--color-muted)]/50 transition-all focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] hover:border-stone-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading && items.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl h-24" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
          <p className="text-[var(--color-muted)]">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white space-y-3">
          <Utensils size={40} className="text-[var(--color-muted)]/30 mx-auto" />
          <p className="text-[var(--color-muted)] font-semibold">Aradığınız kriterlere uygun menü öğesi bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[var(--color-border)] shadow-xs">
          <table className="admin-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Durum</th>
                <th>Öne Çıkan</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="transition-colors">
                  <td>
                    <div className="space-y-0.5">
                      <span className="font-bold text-[var(--color-secondary)] block">{item.name}</span>
                      <span className="text-xs text-[var(--color-muted)] line-clamp-1">{item.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600">
                      {CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                    </span>
                  </td>
                  <td className="font-mono text-sm font-black text-[var(--color-primary)]">₺{item.price}</td>
                  <td>
                    <span className={`badge ${item.isAvailable ? "badge-delivered" : "badge-cancelled"}`}>
                      {item.isAvailable ? "Mevcut" : "Tükendi"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.isFeatured ? "badge-confirmed" : "bg-stone-100 text-stone-400"}`}>
                      {item.isFeatured ? "Evet" : "Hayır"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-all"
                        title="Düzenle"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Lightbox */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-2xl border border-[var(--color-border)] p-6 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-playfair)]">
                  {editingItem ? "Öğeyi Düzenle" : "Yeni Menü Öğesi Ekle"}
                </h3>
                <p className="text-xs text-[var(--color-muted)]">Menü kartı bilgilerini doldurun.</p>
              </div>

              {formError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl text-center font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Öğe Adı</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Old Fashioned"
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MenuItemType["category"])}
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none"
                    >
                      <option value="yemek">Yemekler</option>
                      <option value="kokteyl">Kokteyller</option>
                      <option value="icecek">İçecekler</option>
                      <option value="kahvalti">Kahvaltı</option>
                      <option value="tatli">Tatlılar</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Fiyat (TL)</label>
                    <input
                      type="number"
                      value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Örn: 220"
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="İçerik, servis detayları, alerjenler..."
                    rows={3}
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded border-[var(--color-border)] accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                    />
                    Menüde Mevcut
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-[var(--color-border)] accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                    />
                    Öne Çıkarılan Öğe
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[var(--color-border)] hover:bg-stone-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-bold rounded-lg text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
