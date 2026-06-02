"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, RefreshCw, X, Camera, Image, Sparkles } from "lucide-react";

interface GalleryItemType {
  _id: string;
  title: string;
  category: "lezzet" | "mekan";
  image: string;
}

const CATEGORIES = [
  { id: "all", label: "Tüm Kategoriler" },
  { id: "lezzet", label: "Last Penny Lezzetleri" },
  { id: "mekan", label: "Last Penny'den" },
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
  const [image, setImage] = useState("");
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
    setImage("");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItemType) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImage(item.image);
    setFormError("");
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Görsel boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      setFormError("Lütfen başlık ve görsel alanlarını doldurunuz.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const body = {
        title,
        category,
        image,
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
              {/* Visual preview box using the image */}
              <div className="h-48 w-full rounded-xl mb-4 relative overflow-hidden border border-[var(--color-border)] bg-stone-100 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] tracking-wider font-mono text-white uppercase font-bold">
                  {item.category === "lezzet" ? "Lezzet" : "Mekan"}
                </div>
              </div>

              {/* Text info */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[var(--color-secondary)] text-sm line-clamp-1 font-[family-name:var(--font-playfair)] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[var(--color-muted)] font-medium">
                    Kategori: {item.category === "lezzet" ? "Last Penny Lezzetleri" : "Last Penny'den"}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end mt-auto">
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
                <p className="text-xs text-[var(--color-muted)]">Görsel detaylarını doldurun.</p>
              </div>

              {formError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl text-center font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Görsel İsmi / Başlık</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Kadayıflı Karides"
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Category */}
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

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold block">Görsel</label>
                  
                  {/* Image Preview */}
                  {image && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-stone-100 flex items-center justify-center group mb-2">
                      <img
                        src={image}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/85 text-white p-1.5 rounded-full transition-all"
                        title="Görseli Kaldır"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      image 
                        ? "border-[var(--color-border)] bg-stone-50 hover:bg-stone-100" 
                        : "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10"
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <Image size={24} className="text-[var(--color-muted)] mb-2" />
                        <p className="text-xs text-stone-600 font-medium">
                          {image ? "Görseli Değiştir" : "Görsel Seçmek İçin Tıklayın"}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
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
