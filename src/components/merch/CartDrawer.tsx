"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalPrice,
    toggleCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const router = useRouter();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      toggleCart();
      router.push("/auth/login?redirect=/merch");
      return;
    }

    try {
      setCheckoutLoading(true);
      setErrorMsg("");

      // Map cart items to API format
      const orderItems = items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
      } else {
        setErrorMsg(data.error || "Sipariş verilirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Bağlantı hatası oluştu.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-[var(--color-surface)] border-l border-white/5 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[var(--color-primary)]" />
                <h3 className="font-semibold text-lg">Sepetim ({items.length})</h3>
              </div>
              <button
                onClick={toggleCart}
                className="text-white/40 hover:text-white/95 p-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {orderSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <CheckCircle size={56} className="text-green-500 animate-bounce" />
                  <h4 className="font-bold text-xl text-white">Siparişiniz Alındı!</h4>
                  <p className="text-sm text-white/50 px-6">
                    Last Penny Merch siparişiniz başarıyla oluşturuldu. Sipariş durumunu profilinizden veya admin panelinden takip edebilirsiniz.
                  </p>
                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      toggleCart();
                    }}
                    className="mt-6 px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-secondary)] font-medium text-xs rounded-full uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Alışverişe Devam Et
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-white/30 space-y-3">
                  <ShoppingBag size={48} className="stroke-[1.5]" />
                  <p className="text-sm">Sepetinizde ürün bulunmuyor.</p>
                  <button
                    onClick={toggleCart}
                    className="text-xs text-[var(--color-accent)] hover:underline mt-2"
                  >
                    Mağazaya Göz At
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item._id}-${item.size}`}
                    className="glass p-4 rounded-xl flex gap-4 border border-white/5 relative overflow-hidden"
                  >
                    {/* Visual box placeholder instead of image URL */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shrink-0 flex items-center justify-center text-[var(--color-accent)] text-xs font-mono font-bold">
                      LP
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm text-white/90 truncate pr-6">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item._id, item.size)}
                            className="text-white/30 hover:text-red-400 absolute top-4 right-4 p-1 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                          Beden: {item.size}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/20">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                            className="p-1.5 hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="p-1.5 hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-sm text-[var(--color-accent)] font-mono">
                          ₺{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {!orderSuccess && items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[var(--color-bg)]/80 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Ara Toplam:</span>
                  <span className="font-bold text-lg text-[var(--color-accent)] font-mono">
                    ₺{totalPrice}
                  </span>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 text-center font-medium bg-red-950/20 border border-red-900/30 py-2 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                {!user && (
                  <p className="text-[11px] text-amber-400 text-center bg-amber-950/20 border border-amber-900/30 py-2 rounded-lg px-2">
                    Sipariş tamamlamak için giriş yapmalısınız.
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-[var(--color-secondary)] font-bold text-xs uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {checkoutLoading ? "İşleniyor..." : user ? "Siparişi Tamamla" : "Giriş Yap ve Sipariş Ver"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
