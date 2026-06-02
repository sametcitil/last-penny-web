"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

const QUICK_SUGGESTIONS = [
  { text: "🍷 Kokteyl Önerisi", prompt: "Sana özel imza bir kokteyl önerir misin?" },
  { text: "🍔 Yemeklerde Ne Var?", prompt: "Yemek menüsünde popüler seçenekler neler?" },
  { text: "🍳 Kahvaltı Saatleri", prompt: "Açık büfe kahvaltınız hakkında bilgi verir misin?" },
  { text: "📍 Neredesiniz?", prompt: "Adresinizi ve telefon numaranızı yazar mısın?" },
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages, // Send history for context
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İstek başarısız oldu");

      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Ufak bir bağlantı sorunu yaşıyorum sanırım. Ama sana yine de yardımcı olmaya çalışayım! Mekanımız Kavaklıdere Büklüm Sokak'ta, her gün 01:00'e kadar açığız. Lütfen tekrar sormayı dener misin?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
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
            className="glass-strong w-[320px] sm:w-[400px] h-[480px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden mb-4 border border-[var(--color-primary)]/20 text-[var(--color-secondary)]"
          >
            {/* Header */}
            <div className="bg-[var(--color-surface-hover)] p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <Sparkles size={14} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] font-black text-sm tracking-wide text-[var(--color-primary)]">
                    Last Penny Asistan
                  </h3>
                  <span className="text-[10px] text-[var(--color-accent)] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping inline-block" />
                    Çevrimiçi • Gemini AI Destekli
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-secondary)]/40 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)]/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-primary)] text-white rounded-tr-none font-semibold shadow-sm"
                        : "bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)] rounded-tl-none shadow-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-surface)] text-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5 justify-center bg-transparent">
                {QUICK_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug.prompt)}
                    className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)] text-[var(--color-secondary)]/70 transition-all duration-300 cursor-pointer"
                  >
                    {sug.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bir soru sor..."
                className="flex-1 bg-[var(--color-surface-hover)] text-sm rounded-xl px-4 py-2.5 border border-[var(--color-border)] text-[var(--color-secondary)] placeholder-[var(--color-secondary)]/30 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white disabled:opacity-50 disabled:hover:bg-[var(--color-primary)] transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] flex items-center justify-center text-white shadow-xl cursor-pointer hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 border border-[var(--color-primary-light)]/20 relative overflow-hidden"
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
