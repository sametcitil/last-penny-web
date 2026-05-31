import { NextRequest, NextResponse } from "next/server";
import { mockMenuItems } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });
    }

    // Build menu context for AI
    const menuContext = mockMenuItems
      .filter((item) => item.isAvailable)
      .map(
        (item) =>
          `- ${item.name} (${item.category}): ${item.description} — ₺${item.price}`
      )
      .join("\n");

    const systemPrompt = `Sen "Last Penny" barının yapay zekâ menü asistanısın. Last Penny, Ankara Kavaklıdere'de bulunan bir bar/restoran. Jazz, kültür ve topluluk temalı bir mekan.

Görevin:
- Müşterilere menü hakkında bilgi vermek
- Damak tadına göre yemek/içecek önerileri yapmak
- Mekan hakkında genel bilgi vermek
- Samimi ve sıcak bir dille iletişim kurmak

Mekan Bilgileri:
- Adres: Kavaklıdere, Büklüm Cd No:41/A, 06660 Çankaya/Ankara
- Telefon: (0312) 926 07 21
- Çalışma saatleri: Kapanış 01:00
- Cumartesi-Pazar: Açık büfe kahvaltı (10:00-15:00)
- Canlı müzik etkinlikleri (Jazz, Rock, Akustik)
- İç ve dış mekan oturma alanları

Güncel Menü:
${menuContext}

Kurallar:
- Türkçe yanıt ver
- Kısa ve öz yanıtlar ver (max 3-4 cümle)
- Fiyatları ₺ ile belirt
- Menüde olmayan bir ürün sorulursa, menüdeki alternatifleri öner
- Samimi ol, "siz" yerine "sen" kullan`;

    const conversationHistory = (history || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    // Try Gemini API if key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your-gemini-api-key-here") {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            ...conversationHistory,
            { role: "user", parts: [{ text: message }] },
          ],
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        });

        const text =
          response.text || "Üzgünüm, şu an yanıt veremedim. Tekrar dener misin?";

        return NextResponse.json({ reply: text });
      } catch (aiError) {
        console.error("Gemini API error:", aiError);
        // Fall through to fallback
      }
    }

    // Fallback: rule-based responses
    const reply = getFallbackReply(message, mockMenuItems);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

function getFallbackReply(
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menu: any[]
): string {
  const lower = message.toLowerCase();

  if (lower.includes("merhaba") || lower.includes("selam") || lower.includes("hey")) {
    return "Merhaba! 🎶 Last Penny'ye hoş geldin! Menümüz hakkında bilgi almak ister misin, yoksa bir öneride bulunmamı mı tercih edersin?";
  }

  if (lower.includes("menü") || lower.includes("menu")) {
    const categories = [...new Set(menu.map((m) => m.category))];
    return `Menümüzde ${menu.length} çeşit ürünümüz var! Kategorilerimiz: ${categories.join(", ")}. Hangi kategoriyle ilgileniyorsun?`;
  }

  if (lower.includes("kokteyl") || lower.includes("cocktail")) {
    const cocktails = menu.filter((m) => m.category === "kokteyl");
    return `Kokteyl seçeneklerimiz: ${cocktails.map((c) => `${c.name} (₺${c.price})`).join(", ")}. Hangisini denemek istersin?`;
  }

  if (lower.includes("bira") || lower.includes("beer")) {
    const beers = menu.filter((m) => m.category === "icecek");
    return `Bira seçeneklerimiz: ${beers.map((b) => `${b.name} (₺${b.price})`).join(", ")}. Fıçı biramız çok taze! 🍺`;
  }

  if (lower.includes("yemek") || lower.includes("food") || lower.includes("aç")) {
    const foods = menu.filter((m) => m.category === "yemek");
    return `Yemek seçeneklerimiz: ${foods.map((f) => `${f.name} (₺${f.price})`).join(", ")}. Patatas Bravas en popüler tabanımız! 🔥`;
  }

  if (lower.includes("kahvaltı") || lower.includes("breakfast")) {
    return "Cumartesi-Pazar 10:00-15:00 arası açık büfe kahvaltımız var! Fiyatı ₺350. Gereksiz çeşitlilikten kaçınıp kaliteli ürünlere odaklandık 😊";
  }

  if (lower.includes("adres") || lower.includes("nerede")) {
    return "📍 Kavaklıdere, Büklüm Cd No:41/A, 06660 Çankaya/Ankara. Telefonumuz: (0312) 926 07 21";
  }

  if (lower.includes("saat") || lower.includes("kaçta")) {
    return "⏰ Kapanış saatimiz 01:00. Cumartesi-Pazar kahvaltı 10:00'da başlıyor!";
  }

  if (lower.includes("etkinlik") || lower.includes("konser") || lower.includes("müzik")) {
    return "🎵 Hafta içi akustik performanslar, Cuma-Cumartesi canlı konserler düzenliyoruz. Jazz, rock ve akustik seanslarımız var. Etkinlikler sayfamıza göz atabilirsin!";
  }

  if (lower.includes("öneri") || lower.includes("tavsiye") || lower.includes("ne içeyim") || lower.includes("ne yiyeyim")) {
    const featured = menu.filter((m) => m.isFeatured);
    const random = featured[Math.floor(Math.random() * featured.length)];
    return `Sana ${random.name}'i öneriyorum! ${random.description}. Fiyatı ₺${random.price}. Favorilerimizden biri! ⭐`;
  }

  return "Hmm, tam anlayamadım ama yardımcı olmak isterim! Menü, kokteyl, bira, yemek veya etkinlikler hakkında soru sorabilirsin. Ya da bir öneri isteyebilirsin! 😊";
}
