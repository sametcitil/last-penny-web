"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Calendar, Sparkles, Image } from "lucide-react";

interface EventType {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  isFeatured: boolean;
  image?: string;
  images?: string[];
  price?: number;
  location?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Categories states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=event");
      const data = await res.json();
      if (res.ok) {
        setDynamicCategories(data.categories);
      }
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, type: "event" }),
      });
      if (res.ok) {
        setNewCategoryName("");
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Kategori eklenemedi.");
      }
    } catch {
      alert("Hata oluştu.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Altındaki etkinlikler silinmeyecektir.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Kategori silinemedi.");
      }
    } catch {
      alert("Hata oluştu.");
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events);
      } else {
        setError(data.error || "Etkinlikler yüklenemedi.");
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (dynamicCategories.length > 0 && !category) {
      setCategory(dynamicCategories[0].slug);
    }
  }, [dynamicCategories, category]);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setCategory(dynamicCategories[0]?.slug || "");
    setIsFeatured(false);
    setImages([]);
    setPrice(0);
    setLocation("LP Kavaklıdere Sahne");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (event: EventType) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    
    // Format ISO string date to 'YYYY-MM-DD' for date input
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    setDate(formattedDate);
    setTime(event.time || "");
    setCategory(event.category);
    setIsFeatured(event.isFeatured || false);
    setImages(event.images || (event.image ? [event.image] : []));
    setPrice(event.price || 0);
    setLocation(event.location || "LP Kavaklıdere Sahne");
    setFormError("");
    setModalOpen(true);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormError("");
    
    const promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error("Görsel boyutu 5MB'dan küçük olmalıdır."));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Dosya okunamadı."));
          }
        };
        reader.onerror = () => reject(new Error("Dosya okunamadı."));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((results) => {
        setImages((prev) => [...prev, ...results]);
      })
      .catch((err) => {
        setFormError(err.message || "Görseller yüklenirken bir hata oluştu.");
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !category) {
      setFormError("Lütfen başlık, kategori, tarih ve saat alanlarını doldurunuz.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      
      const body = { 
        title, 
        description, 
        date: new Date(date).toISOString(), 
        time, 
        category, 
        isFeatured,
        images,
        price,
        location
      };

      const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        fetchEvents();
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
    if (!confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEvents();
      } else {
        const data = await res.json();
        alert(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      alert("Sunucu hatası.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryLabel = (slug: string) => {
    return dynamicCategories.find((c) => c.slug === slug)?.name || slug;
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 text-[var(--color-secondary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-playfair)] tracking-wide">
            Etkinlik Yönetimi
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">Konserler, caz geceleri ve söyleşileri organize edin.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200"
          >
            Kategorileri Yönet
          </button>
          <button
            onClick={fetchEvents}
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
            Yeni Etkinlik Ekle
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            placeholder="Etkinliklerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] text-sm placeholder-[var(--color-muted)]/50 transition-all focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === "all"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] hover:border-stone-400"
            }`}
          >
            Tüm Kategoriler
          </button>
          {dynamicCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat.slug
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] hover:border-stone-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading && events.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl h-24" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
          <p className="text-[var(--color-muted)]">{error}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-2xl bg-white space-y-3">
          <Calendar size={40} className="text-[var(--color-muted)]/30 mx-auto" />
          <p className="text-[var(--color-muted)] font-semibold">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[var(--color-border)] shadow-xs">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Etkinlik Adı</th>
                <th>Kategori</th>
                <th>Tarih & Saat</th>
                <th>Fiyat</th>
                <th>Öne Çıkan</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id} className="transition-colors">
                  <td>
                    <div className="space-y-0.5 max-w-sm">
                      <span className="font-bold text-[var(--color-secondary)] block truncate">{event.title}</span>
                      <span className="text-xs text-[var(--color-muted)] line-clamp-1">{event.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-stone-100 rounded-lg text-stone-600">
                      {getCategoryLabel(event.category)}
                    </span>
                  </td>
                  <td>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-semibold text-[var(--color-secondary)] block font-mono">{formatDate(event.date)}</span>
                      <span className="text-[10px] text-[var(--color-muted)] block font-mono">Saat: {event.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-[var(--color-primary)] font-mono">
                      {event.price && event.price > 0 ? `₺${event.price}` : "Giriş Serbest"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${event.isFeatured ? "badge-confirmed" : "bg-stone-100 text-stone-400"}`}>
                      {event.isFeatured ? "Evet" : "Hayır"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] rounded-xl transition-all"
                        title="Düzenle"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
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
                  {editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}
                </h3>
                <p className="text-xs text-[var(--color-muted)]">Sahne ve etkinlik takvimi detaylarını doldurun.</p>
              </div>

              {formError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl text-center font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Etkinlik Başlığı</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Jazz Quartet Konseri"
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Date, Time & Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Tarih</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Saat</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="Örn: 21:00"
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {dynamicCategories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Bilet Fiyatı (TL)</label>
                    <input
                      type="number"
                      value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Ücretsiz için 0 bırakın"
                      className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Konum / Sahne</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Örn: LP Kavaklıdere Sahne"
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sanatçılar, bilet/giriş bilgileri, rezervasyon detayları..."
                    rows={4}
                    className="w-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white"
                  />
                </div>

                {/* Multiple Images Upload & Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] font-semibold block">Görseller</label>
                  
                  {images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-stone-100 flex-shrink-0">
                          <img src={img} alt={`Önizleme ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/85 text-white p-1 rounded-full transition-all"
                            title="Görseli Kaldır"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3 px-4 text-center">
                        <Plus size={18} className="text-[var(--color-primary)] mb-1" />
                        <p className="text-xs text-stone-600 font-medium">Görsel Ekle (Çoklu Seçilebilir)</p>
                        <p className="text-[9px] text-stone-400 mt-0.5">PNG, JPG, JPEG (Maks. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleFilesChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-[var(--color-border)] accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
                    />
                    <Sparkles size={12} className="text-amber-500 shrink-0 inline mr-1" />
                    Öne Çıkarılan Etkinlik
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

      {/* Category Manager Modal */}
      <AnimatePresence>
        {categoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCategoryModalOpen(false)}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-2xl border border-[var(--color-border)] p-6 space-y-6 relative max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="font-bold text-lg font-[family-name:var(--font-playfair)] text-[var(--color-secondary)]">
                  Kategorileri Yönet
                </h3>
                <p className="text-xs text-[var(--color-muted)]">Etkinlikler için geçerli olan kategorileri ekleyin veya silin.</p>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Yeni Kategori Adı"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-bold rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    Ekle
                  </button>
                </div>
              </form>

              {/* Categories List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {dynamicCategories.length === 0 ? (
                  <p className="text-xs text-[var(--color-muted)] text-center py-4">Kategori bulunamadı.</p>
                ) : (
                  dynamicCategories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)]"
                    >
                      <span className="text-xs font-semibold text-[var(--color-secondary)]">{cat.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
