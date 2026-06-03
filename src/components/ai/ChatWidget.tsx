"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, AlertTriangle } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

const QUICK_SUGGESTIONS = [
  { text: "🍷 Kokteyl Önerisi", prompt: "Sana özel imza bir kokteyl önerir misin?" },
  { text: "🍔 Yemeklerde Ne Var?", prompt: "Yemek menüsünde popüler seçenekler neler?" },
  { text: "🍳 Kahvaltı Saatleri", prompt: "Açık büfe kahvaltınız hakkında bilgi verir misin?" },
  { text: "📍 Neredesiniz?", prompt: "Adresinizi ve telephone numaranızı yazar mısın?" },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Merhaba! 🎶 Last Penny'ye hoş geldin! Ben senin menü ve mekan asistanınım. Sana nefis bir kokteyl önerebilirim, yemeklerimizden bahsedebilirim veya bu haftaki etkinliklerimizi söyleyebilirim. Nasıl yardımcı olayım? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lockTime, setLockTime] = useState<number>(0);

  // ─── ŞİKAYET / ÖNERİ MODU STATE'LERİ ───
  const [isFormMode, setIsFormMode] = useState(false);
  const [formInput, setFormInput] = useState("");

  useEffect(() => {
    if (lockTime <= 0) return;
    const timer = setInterval(() => {
      setLockTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockTime]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading, isFormMode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}s ` : ""}${m > 0 ? `${m}dk ` : ""}${s}sn`;
  };

  const handleSendMessage = async (textToSend: string, isFromForm: boolean = false) => {
    if (!textToSend.trim() || isLoading || (!isFromForm && lockTime > 0)) return;

    setIsLoading(true);

    if (isFromForm) {
      setMessages((prev) => [...prev, { role: "user", content: `📝 [Yönetime Geri Bildirim]: ${textToSend}` }]);
      setIsFormMode(false);
      setFormInput("");
    } else {
      setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
      setInput("");
    }

    try {
      const finalPayloadMessage = isFromForm ? `[FORM_SUBMIT]: ${textToSend}` : textToSend;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalPayloadMessage,
          history: messages,
        }),
      });

      const data = await res.json();
      
      if (res.status === 429 || data.errorType === "RATE_LIMIT_EXHAUSTED") {
        const penaltySeconds = data.retryAfter || 3600;
        setLockTime(penaltySeconds);
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: `Saatlik 3 soru sorma hakkınız dolmuştur. Güvenlik ve kota limitleri sebebiyle 1 saatlik bekleme modundasınız. Kalan süre: ${formatTime(penaltySeconds)}`,
          },
        ]);
        return;
      }

      if (!res.ok || data.error) throw new Error(data.error || "İstek başarısız oldu");

      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Tezgahta bardaklar karıştı sanırım! Rica etsem bu soruyu barmenimiz için tekrar gönderebilir misin? 🍷",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input, false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(formInput, true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="glass-strong w-[320px] sm:w-[400px] h-[520px] max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden mb-4 border border border-[var(--color-primary)]/20 text-[var(--color-secondary)] bg-[#141414]"
          >
            {/* Header */}
            <div className="bg-[var(--color-surface-hover)] p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[#1f1f1f] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center bg-red-800">
                  <Sparkles size={14} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] font-black text-sm tracking-wide text-[var(--color-primary)] text-red-500">
                    {isFormMode ? "Last Penny Şikayet & Öneri" : "Last Penny Asistan"}
                  </h3>
                  <span className="text-[10px] text-[var(--color-accent)] font-semibold flex items-center gap-1 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${lockTime > 0 ? "bg-amber-500 animate-pulse" : "bg-green-600 animate-ping"} inline-block`} />
                    {lockTime > 0 ? `Limit Doldu (Kalan: ${formatTime(lockTime)})` : isFormMode ? "Doğrudan Yönetime Gider" : "Çevrimiçi • Gemini AI Destekli"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); setIsFormMode(false); }}
                className="text-[var(--color-secondary)]/40 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)]/5 transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* ─── YENİ DÜZEN: EN ÜSTE SABİTLENEN HAZIR MESAJLAR & ŞİKAYET BAR BARİERİ ─── */}
            {!isFormMode && !isLoading && lockTime === 0 && (
              <div className="px-3 py-2.5 bg-[#1b1b1b] border-b border-gray-800 flex flex-col gap-2 shrink-0 z-10 shadow-md">
                <div className="flex flex-wrap gap-1 justify-center">
                  {QUICK_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug.prompt, false)}
                      className="text-[9px] font-bold px-2.5 py-1.5 rounded-full bg-[#242424] border border-gray-700 hover:border-red-500 text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      {sug.text}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormMode(true)}
                  className="w-full text-[9px] font-extrabold py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-200 text-center cursor-pointer"
                >
                  ⚠️ Şikayet veya Öneride Bulun (Yönetim E-Posta Hattı)
                </button>
              </div>
            )}

            {/* ŞİKAYET FORMU EKRANI */}
            {isFormMode ? (
              <form onSubmit={handleFormSubmit} className="flex-1 p-4 flex flex-col justify-between bg-[#181818]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>Geri bildiriminiz doğrudan info@lastpenny.com adresine mail olarak uçacaktır.</span>
                  </div>
                  <label className="text-xs text-gray-400 block font-semibold">Mesajınız:</label>
                  <textarea
                    value={formInput}
                    onChange={(e) => setFormInput(e.target.value)}
                    placeholder="Şikayet veya önerilerinizi buraya yazın..."
                    className="w-full h-[160px] bg-[#242424] text-sm rounded-xl p-3 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsFormMode(false); setFormInput(""); }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formInput.trim()}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Formu Gönder
                  </button>
                </div>
              </form>
            ) : (
              /* SOHBET AKIŞ ALANI - ARTIK EN ÜST BARIN ALTINDA ÖZGÜRCE KAYAR */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-[#181818]">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-red-700 text-white rounded-tr-none font-semibold shadow-sm"
                            : "bg-[#242424] text-gray-200 border border-gray-700 rounded-tl-none shadow-xs"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#242424] border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-3 border-t border-gray-800 bg-[#181818] flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={lockTime > 0 ? `Limit Doldu (${formatTime(lockTime)} kaldı)...` : "Bir soru sor..."}
                    className="flex-1 bg-[#242424] text-sm rounded-xl px-4 py-2.5 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition-colors disabled:opacity-60"
                    disabled={isLoading || lockTime > 0}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || lockTime > 0}
                    className="p-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-red-700 hover:bg-red-600 flex items-center justify-center text-white shadow-xl cursor-pointer border border-red-500/20 relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}