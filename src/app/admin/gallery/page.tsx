"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, RefreshCw, X, Camera, Image, Sparkles } from "lucide-react";

interface GalleryItemType {
  _id: string;
  title: string;
  category: "lezzet" | "mekan";
  description: string;
  gradient: string;
  iconName: string;
  quote?: string;
  quoteAuthor?: string;
}

const CATEGORIES = [
  { id: "all", label: "Tüm Kategoriler" },
  { id: "lezzet", label: "Last Penny Lezzetleri" },
  { id: "mekan", label: "Last Penny'den" },
];

const ICONS = ["Coffee", "Music", "Sparkles", "Heart", "Camera"];

const GRADIENTS = [
  { value: "from-amber-950/80 via-slate-900 to-amber-900/80", label: "Ahşap & Nostalji (Kahve)" },
  { value: "from-indigo-950/80 via-slate-900 to-purple-900/80", label: "Gece & Caz (Lacivert)" },
  { value: "from-red-950/80 via-slate-900 to-rose-900/80", label: "Kırmızı Kokteyl (Kırmızı)" },
  { value: "from-teal-950/80 via-slate-900 to-emerald-900/80", label: "Kültür & Kitap (Yeşil)" },
  { value: "from-yellow-950/80 via-slate-900 to-amber-950/80", label: "Altın Analog (Sarı)" },
  { value: "from-fuchsia-950/80 via-slate-900 to-violet-900/80", label: "Eğlence & Dostlar (Mor)" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemType | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryItemType["category"]>("lezzet");
  const [description, setDescription] = useState("");
  const [gradient, setGradient] = useState(GRADIENTS[0].value);
  const [iconName, setIconName] = useState("Coffee");
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
      } else {
        setError(data.error || "Galeri yüklenemedi.");
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
    setTitle("");
    setCategory("lezzet");
    setDescription("");
    setGradient(GRADIENTS[0].value);
    setIconName("Coffee");
    setQuote("");
    setQuoteAuthor("");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItemType) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setGradient(item.gradient);
    setIconName(item.iconName || "Coffee");
    setQuote(item.quote || "");
    setQuoteAuthor(item.quoteAuthor || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setFormError("Lütfen başlık ve açıklama alanlarını doldurunuz.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const body = {
        title,
        category,
        description,
        gradient,
        iconName,
        quote,
        quoteAuthor,
      };

      const url = editingItem ? `/api/gallery/${editingItem._id}` : "/api/gallery";
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
    if (!confirm("Bu galeri öğesini silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
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
    return categoryFilter === "all" || item.category === categoryFilter;
  });

  return (
    <div className="space-y-8 text-[var(--color-secondary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-playfair)] tracking-wide">
            Galeri Yönetimi
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Mekan atmosferi ve topluluk görsellerini düzenleyin.</p>
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

      {/* Filter Category */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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

      {/* Gallery Grid */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl h-64" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
          <p className="text-[var(--color-muted)]">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white space-y-3">
          <Camera size={40} className="text-[var(--color-muted)]/30 mx-auto" />
          <p className="text-[var(--color-muted)] font-semibold">Aradığınız kategoride galeri öğesi bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Visual preview box using the gradient */}
              <div className={`h-40 w-full bg-gradient-to-br ${item.gradient} rounded-xl mb-4 relative flex items-center justify-center p-4 border border-[var(--color-border)] overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="z-10 text-center">
                  <span className="text-[9px] tracking-[0.2em] font-mono text-amber-200 block uppercase font-bold mb-1">
                    {item.category === "lezzet" ? "Lezzet" : "Mekan"}
                  </span>
                  <h4 className="font-bold text-white text-sm line-clamp-1 font-[family-name:var(--font-playfair)]">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Text info */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[var(--color-secondary)]/85 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.quote && (
                    <p className="text-[10px] italic text-[var(--color-muted)] border-l-2 border-[var(--color-primary)]/30 pl-2 mt-2">
                      &ldquo;{item.quote}&rdquo; — {item.quoteAuthor || "Anonim"}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-mono font-bold text-[var(--color-muted)]">
                    İkon: {item.iconName || "Camera"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-all"
                      title="Düzenle"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                  {editingItem ? "Galeri Öğesini Düzenle" : "Yeni Galeri Öğesi Ekle"}
                </h3>
                <p className="text-xs text-[var(--color-muted)]">Atmosfer ve detay bilgilerini doldurun.</p>
              </div>

              {formError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl text-center font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Görsel Başlığı</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Akustik Köşe"
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Category & Icon & Gradient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GalleryItemType["category"])}
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none"
                    >
                      <option value="lezzet">Last Penny Lezzetleri (Yemek, Kokteyl vb.)</option>
                      <option value="mekan">Last Penny'den (Mekan Fotoğrafları)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">İkon</label>
                    <select
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none"
                    >
                      {ICONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {ico}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Görsel Renk Gradyanı</label>
                  <select
                    value={gradient}
                    onChange={(e) => setGradient(e.target.value)}
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none"
                  >
                    {GRADIENTS.map((grad) => (
                      <option key={grad.value} value={grad.value}>
                        {grad.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mekan veya görselin hissini anlatan kısa detay..."
                    rows={3}
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Optional Quote */}
                <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
                  <span className="text-[10px] tracking-wider uppercase font-bold font-mono text-[var(--color-primary)]">Alıntı Söz Ekle (İsteğe Bağlı)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Alıntı Söz</label>
                      <input
                        type="text"
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        placeholder="Örn: Caz, özgürlüğün sesidir."
                        className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Söz Yazarı</label>
                      <input
                        type="text"
                        value={quoteAuthor}
                        onChange={(e) => setQuoteAuthor(e.target.value)}
                        placeholder="Örn: Thelonious Monk"
                        className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                      />
                    </div>
                  </div>
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
