import { NextRequest, NextResponse } from "next/server";
import { mockMenuItems } from "@/lib/mock-data";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";

interface RateLimitInfo {
  count: number;
  resetTime: number;
  isPenalized: boolean;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const currentTime = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  let userLimit = rateLimitMap.get(ip);
  if (!userLimit) {
    userLimit = { count: 0, resetTime: currentTime + ONE_HOUR, isPenalized: false };
    rateLimitMap.set(ip, userLimit);
  }

  if (currentTime > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = currentTime + ONE_HOUR;
    userLimit.isPenalized = false;
    rateLimitMap.set(ip, userLimit);
  }

  if (userLimit.isPenalized || userLimit.count >= 10) {
    userLimit.isPenalized = true;
    const timeLeftMs = userLimit.resetTime - currentTime;
    return NextResponse.json(
      { errorType: "RATE_LIMIT_EXHAUSTED", error: "Saatlik limit doldu.", retryAfter: Math.ceil(timeLeftMs / 1000) },
      { status: 429 }
    );
  }

  let globalMessage = "";

  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });

    globalMessage = message;
    const lower = globalMessage.toLowerCase().trim();

    // ─── KESİN ŞİKAYET/ÖNERİ FORM TETİKLENMESİ ───
    if (message.startsWith("[FORM_SUBMIT]:")) {
      const formContent = message.replace("[FORM_SUBMIT]:", "").trim();
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey && resendApiKey !== "your-resend-key") {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: "Last Penny Asistan <onboarding@resend.dev>",
            to: "yigitmertsakca@gmail.com",
            subject: "Müşteri Geri Bildirimi: Şikayet / Öneri Formu",
            html: `<h3>Last Penny Yönetimine Yeni Bildirim!</h3><p><strong>Mesaj:</strong> "${formContent}"</p>`
          });
        } catch (mailError) {
          console.error("Resend e-posta hatası:", mailError);
        }
      }

      userLimit.count += 1;
      return NextResponse.json({
        reply: "Geri bildirim formunuz başarıyla alındı! Detaylar anında info@lastpenny.com adresine resmi bir e-posta olarak iletildi. Mekanımızı geliştirmemize katkı sağladığınız için çok teşekkür ederiz. 🎶🍷",
        remainingRights: 10 - userLimit.count
      });
    }

    const menu = mockMenuItems || [];
    const availableMenu = menu.filter((item) => item.isAvailable);

    const menuContext = availableMenu
      .map((item) => `- Ürün: ${item.name} | Kategori: ${item.category} | Açıklama: ${item.description} | Fiyat: ₺${item.price}`)
      .join("\n");

    const categories = [...new Set(availableMenu.map((item) => item.category))].join(", ");

    const historyList = history || [];
    const pastModelReplies = historyList
      .filter((h: any) => h.role === "model")
      .map((h: any) => h.content || "")
      .join(" ");

    // ─── YAPAY ZEKA TALİMATLARI (GELİŞTİRİLMİŞ İÇERİK ANLATIM MOTORU) ───
    const systemPrompt = `Sen "Last Penny" barının samimi, esnek ve oldukça deneyimli barmeni/şefisin. Adın "Penny".
Last Penny, Ankara Kavaklıdere'de bulunan caz, kültür ve topluluk temalı sıcak bir mekandır.

## KESİN GÖREVLERİN (KENDİ YAPAY ZEKANI KULLAN):
1. Müşteri sadece "merhaba", "selam", "hey", "slm" gibi selamlama mesajları attığında doğrudan menüden bir ürün seçip önerme! "Last Penny tezgahına hoş geldin dostum! 🎶 Ben barmen Penny. Keyifli bir caz akşamında sana bugün menümüzden ekşi, tatlı, acı imza kokteyllerimiz veya mutfağımızdan nefis şef tabakları arasından ne ikram edelim, masana ne hazırlayalım? 😊" şeklinde sıcak, merak uyandıran bir selamlama yap ve topu tamamen müşterinin tercihine bırak.
2. SADECE sana verilen güncel menüdeki aktif ürünleri öner. Menüde yer almayan hiçbir malzemeyi veya yiyecek/içecek adını kafana göre uydurma.
3. KESİNTİSİZ İÇERİK KURALI: Müşteri bir yiyecek veya içecek talep ettiğinde (Örn: "tatlı bir içecek", "acı bir yemek"), menü bağlamında sana iletilen ürünün adını ve fiyatını söylerken, İÇERİĞİNİ/AÇIKLAMASINI da müşterinin isteğine tam uyacak şekilde gurme ve detaylı bir dille açıkla! Müşteriye sadece ürün adı söyleyip geçmek kesinlikle yasaktır.
4. Müşteri senden "başka", "farklı" veya "alternatif" bir şey istediğinde, sohbet geçmişinde daha önce sunduğun ürünü ASLA tekrar önerme! Menüdeki diğer alternatif kombinasyonlara geçiş yap.
5. "Yapay zeka analizime göre" veya "veritabanı" gibi robotik kalıplar kullanman KESİNLİKLE YASAKTIR. Gerçek bir barmen gibi samimi, esnek, kısa and öz yanıtlar ver (maksimum 3-4 cümle).

## DAHA ÖNCE ÖNERDİĞİN ÜRÜNLER (BUNLARI TEKRAR ETME):
${pastModelReplies}

## MENÜ KATEGORİLERİ: ${categories}

## GÜNCEL LAST PENNY MENÜSÜ:
${menuContext}`;

    const apiKey = process.env.GEMINI_API_KEY?.replace(/['"]/g, "");
    if (!apiKey) throw new Error("API_KEY_MISSING");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: systemPrompt });

    let formattedHistory = historyList
      .filter((msg: { role: string; content: string }) => msg.content?.trim() && !msg.content.includes("[FORM_SUBMIT]:"))
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    const cleanHistory = [];
    for (let i = 0; i < formattedHistory.length; i++) {
      if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== formattedHistory[i].role) {
        cleanHistory.push(formattedHistory[i]);
      }
    }

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: { maxOutputTokens: 350, temperature: 0.75 }
    });

    const result = await chat.sendMessage(message);
    const replyText = result.response.text();

    if (replyText) {
      userLimit.count += 1;
      rateLimitMap.set(ip, userLimit);
      return NextResponse.json({ reply: replyText, remainingRights: 10 - userLimit.count });
    }

    throw new Error("Boş yanıt döndü.");

  } catch (error: any) {
    console.error("====== KOTA KORUMA SİMÜLATÖRÜ DEVREDE ======");
    const lower = globalMessage.toLowerCase().trim();
    const menu = mockMenuItems || [];
    const availableMenu = menu.filter(i => i.isAvailable);
    const count = userLimit ? userLimit.count : 0;

    const drinks = availableMenu.filter(item => item.category === "kokteyl" || item.category === "icecek");
    const foods = availableMenu.filter(item => item.category === "yemek");

    if (userLimit) userLimit.count += 1;

    // SİMÜLATÖR KORUMASI: Yalın Selamlama Algılayıcı (En başta tetiklenir)
    if (lower === "merhaba" || lower === "selam" || lower === "slm" || lower === "mrh" || lower === "hey" || lower === "iyi günler") {
      return NextResponse.json({
        reply: "Last Penny tezgahına hoş geldin dostum! 🎶 Ben barmeniniz Penny. Keyifli bir caz akşamında sana bugün menümüzden ekşi, tatlı, acı imza kokteyllerimiz veya mutfağımızdan nefis şef tabakları arasından ne ikram edelim, masana ne hazırlayalım? 😊",
        remainingRights: 10 - count
      });
    }

    // Listeleme Talebi
    if (lower.includes("tüm") || lower.includes("hepsi") || lower.includes("liste") || lower.includes("neler")) {
      const listText = drinks.map(d => `• **${d.name}** (₺${d.price}) - *${d.description}*`).join("\n");
      return NextResponse.json({ reply: `Last Penny bar tezgahındaki güncel içecek listemizi senin için hazırladım dostum! 🍹\n\n${listText}\n\nHangisiyle başlamak istersin? 😊`, remainingRights: 10 - count });
    }

    // Yemek İstekleri Katmanı
    if (lower.includes("yemek") || lower.includes("burger") || lower.includes("açım") || lower.includes("yiyecek")) {
      let matchedFoods = foods;
      if (lower.includes("acı") || lower.includes("bahar")) {
        matchedFoods = foods.filter(f => f.description.toLowerCase().includes("acı") || f.name.toLowerCase().includes("bravas") || f.description.toLowerCase().includes("jalapeño"));
      }
      if (lower.includes("başka") || lower.includes("baska") || lower.includes("farklı")) {
        const filteredPool = matchedFoods.filter(f => f.name !== "Tavuk Kanatları");
        if (filteredPool.length > 0) matchedFoods = filteredPool;
      }
      const selectedFood = matchedFoods[Math.floor(Math.random() * matchedFoods.length)] || foods[0];
      return NextResponse.json({ reply: `İsteğin üzerine hemen harika bir lezzet seçeneğine geçiyorum dostum! Şefimizin senin için taze taze hazırlayacağı **${selectedFood.name}** (₺${selectedFood.price}) tabağımızı öneriyorum. İçeriğindeki **${selectedFood.description}** detayları ile tam aradığın kriterlerde harika bir gurme deneyimi sunacaktır. Siparişini mutfağa geçeyim mi? 🍔`, remainingRights: 10 - count });
    }

    // İçecek ve Tat Durumları Katmanı (Simülatör İçerik Tamamlama Alanı)
    if (lower.includes("kokteyl") || lower.includes("içecek") || lower.includes("alkol") || lower.includes("tatlı") || lower.includes("ekşi")) {
      let matchedDrinks = drinks;
      if (lower.includes("tatlı") || lower.includes("tatli")) {
        const sangria = drinks.find(d => d.name.toLowerCase().includes("sangria") || d.description.toLowerCase().includes("tatlı") || d.description.toLowerCase().includes("meyve"));
        if (sangria) {
          return NextResponse.json({ reply: `Bar tezgahımızdan harika ve tam aradığın tatlılıkta bir seçim! Sana özel imza tarifimiz olan **${sangria.name}** (₺${sangria.price}) kokteylimizi öneririm. İçeriğindeki **${sangria.description}** notaları ile damakta inanılmaz keyifli bir dokunuş bırakır. Masana gönderelim mi? 🍹🍓`, remainingRights: 10 - count });
        }
      }
      if (lower.includes("ekşi") || lower.includes("eksi")) {
        const sour = drinks.find(d => d.name.toLowerCase().includes("sour") || d.description.toLowerCase().includes("ekşi"));
        if (sour) {
          return NextResponse.json({ reply: `Ferahlatıcı ve ekşi tonlar barımızın vazgeçilmezidir! Sana listemizden nefis dengesiyle öne çıkan **${sour.name}** (₺${sour.price}) kokteylimizi hazırlayabilirim. İçeriğindeki **${sour.description}** canlandırıcı aromasıyla harika bir barlık tercihtir. Sallayalım mı? 🍋`, remainingRights: 10 - count });
        }
      }
      const selectedDrink = drinks[Math.floor(Math.random() * drinks.length)];
      return NextResponse.json({ reply: `Bar tezgahımızdan harika bir tercih! Sana şu an pürüzsüzce hazırlayabileceğimiz **${selectedDrink.name}** (₺${selectedDrink.price}) içeceğimizi öneririm. İçeriğindeki **${selectedDrink.description}** ile barda tam bir favoridir. Masana gönderelim mi? 🍹`, remainingRights: 10 - count });
    }

    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
    return NextResponse.json({ reply: `Bar tezgahımızdan harika bir tercih! Sana şu an pürüzsüzce hazırlayabileceğimiz **${randomDrink.name}** (₺${randomDrink.price}) içeceğimizi öneririm. İçeriğindeki ${randomDrink.description} ile barda tam bir favoridir. Masana gönderelim mi? 🍹`, remainingRights: 10 - count });
  }
}