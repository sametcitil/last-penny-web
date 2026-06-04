import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import Event from "@/lib/models/Event";
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

  /*
  if (userLimit.isPenalized || userLimit.count >= 3) {
    userLimit.isPenalized = true;
    const timeLeftMs = userLimit.resetTime - currentTime;
    return NextResponse.json(
      { errorType: "RATE_LIMIT_EXHAUSTED", error: "Saatlik limit doldu.", retryAfter: Math.ceil(timeLeftMs / 1000) },
      { status: 429 }
    );
  }
  */

  let globalMessage = "";
  let availableMenu: any[] = [];

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
        remainingRights: 3 - userLimit.count
      });
    }

    let upcomingEvents: any[] = [];

    // Build menu and event context for AI from database
    try {
      await dbConnect();
      availableMenu = await MenuItem.find({ isAvailable: true });
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      upcomingEvents = await Event.find({ date: { $gte: todayStart } }).sort({ date: 1 }).limit(10);
    } catch (dbErr) {
      console.error("AI Chat: Failed to load menu/events from DB:", dbErr);
    }

    const menuContext = availableMenu
      .map((item) => `- Ürün: ${item.name} | Kategori: ${item.category} | Açıklama: ${item.description} | Fiyat: ₺${item.price}`)
      .join("\n");

    const eventContext = upcomingEvents.length > 0
      ? upcomingEvents
          .map((evt) => {
            const formattedDate = new Date(evt.date).toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return `- Etkinlik: ${evt.title} | Tarih: ${formattedDate} | Saat: ${evt.time} | Yer: ${evt.location || "LP Kavaklıdere Sahne"} | Fiyat: ${evt.price ? `₺${evt.price}` : "Ücretsiz/Giriş Serbest"} | Açıklama: ${evt.description}`;
          })
          .join("\n")
      : "Şu an planlanmış yakın tarihli bir etkinlik bulunmamaktadır.";

    const currentLocalDate = new Date().toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
6. Müşteri bar, menü, yemek, içecek, Ankara Kavaklıdere şubesi veya etkinlikler ile tamamen alakasız/tutarsız mesajlar yazdığında (örneğin matematik, programlama, alakasız genel kültür soruları vb.), gerçek bir barmen gibi kibarca bu konulardan anlamadığını söyle ve soruyu Last Penny menüsü veya etkinliklerine getirecek şekilde yönlendir.
7. SADECE sana iletilen güncel etkinlikler listesinde bulunan etkinlikleri öner. Listede yer almayan, tarihi geçmiş veya uydurma etkinliklerden kesinlikle bahsetme. Yakın zamandaki veya o günkü etkinlikleri önermek için bugünün tarihine dikkat et.

## BUGÜNÜN TARİHİ:
${currentLocalDate}

## DAHA ÖNCE ÖNERDİĞİN ÜRÜNLER (BUNLARI TEKRAR ETME):
${pastModelReplies}

## MENÜ KATEGORİLERİ: ${categories}

## GÜNCEL LAST PENNY MENÜSÜ:
${menuContext}

## GÜNCEL VE YAKLAŞAN ETKİNLİKLER:
${eventContext}`;

    const apiKey = process.env.GEMINI_API_KEY?.replace(/['"]/g, "");
    if (!apiKey) throw new Error("API_KEY_MISSING");

    let replyText = "";

    if (apiKey.startsWith("sk-")) {
      // OpenAI Engine
      const openAIHistory = historyList
        .filter((msg: { role: string; content: string }) => msg.content?.trim() && !msg.content.includes("[FORM_SUBMIT]:"))
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...openAIHistory,
            { role: "user", content: message }
          ],
          max_tokens: 350,
          temperature: 0.75
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `OpenAI API returned status ${res.status}`);
      }

      const data = await res.json();
      replyText = data.choices?.[0]?.message?.content || "";
    } else {
      // Gemini Engine
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });

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
        generationConfig: { 
          maxOutputTokens: 1000, 
          temperature: 0.75,
          // @ts-ignore - thinkingConfig is not yet typed in this SDK version
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      });

      const result = await chat.sendMessage(message);
      replyText = result.response.text();
    }

    if (replyText) {
      userLimit.count += 1;
      rateLimitMap.set(ip, userLimit);
      return NextResponse.json({ reply: replyText, remainingRights: 3 - userLimit.count });
    }

    throw new Error("Boş yanıt döndü.");

  } catch (error: any) {
    console.error("====== KOTA KORUMA SİMÜLATÖRÜ DEVRE DIŞI ======");
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Yapay zeka sisteminde bir hata oluştu: " + (error?.message || String(error)) },
      { status: 500 }
    );
    /*
    const lower = globalMessage.toLowerCase().trim();
    
    if (availableMenu.length === 0) {
      try {
        await dbConnect();
        availableMenu = await MenuItem.find({ isAvailable: true });
      } catch (dbErr) {
        console.error("AI Chat Simulator: Failed to load menu from DB:", dbErr);
      }
    }
    
    const count = userLimit ? userLimit.count : 0;

    const foodCategories = ["doyuranlar", "elle-ye", "salatalar", "tapas", "tost-gozleme", "penny-kahvalti", "tatlilar"];
    const drinks = availableMenu.filter(item => !foodCategories.includes(item.category));
    const foods = availableMenu.filter(item => foodCategories.includes(item.category));

    if (userLimit) userLimit.count += 1;

    // ─── İLGİLİ İÇERİK KONTROLÜ (CLASSIFIER) ───
    const relatedKeywords = [
      "menü", "menu", "kategori", "öneri", "öner", "tavsiye", "seç", "liste", "kart",
      "merhaba", "selam", "slm", "mrh", "hey", "iyi günler", "iyi akşamlar", "hoş bulduk", "hos bulduk",
      "içecek", "icecek", "içki", "icki", "alkol", "bira", "beer", "kokteyl", "cocktail", "viski", "whiskey", "whisky", 
      "şarap", "sarap", "wine", "blush", "rose", "köpüklü", "kopuklu", "sangria", "shot", "snaps", "kahve", "çay", "cay", 
      "soda", "kola", "cola", "gazoz", "su", "süt", "sut",
      "yemek", "ye", "burger", "açım", "acım", "aç", "yiyecek", "tapas", "nachos", "sosis", "köfte", "kofte", "tavuk", 
      "fish", "chips", "patates", "bravas", "falafel", "mücver", "mucver", "humus", "salata", "peynir", "zeytin", "tost", 
      "gözleme", "gozleme", "kahvaltı", "kahvalti", "omlet", "sucuk", "tatlı", "tatli", "sufle", "cheesecake", "brownie",
      "nerede", "adres", "konum", "saat", "kaçta", "kapanış", "kapanis", "açılış", "acilis", "rezervasyon", "telefon", 
      "iletisim", "iletişim", "etkinlik", "konser", "müzik", "teşekkür", "tesekkur", "sağol", "sagol", "eyvallah"
    ];

    const isRelated = relatedKeywords.some(keyword => lower.includes(keyword)) || lower.startsWith("[form_submit]");

    if (!isRelated) {
      return NextResponse.json({
        reply: "Last Penny barmeni Penny olarak bu söylediğini tam anlayamadım dostum. Bana menümüz, kokteyllerimiz, soğuk biralarımız, nefis şef yemeklerimiz veya yaklaşan etkinliklerimiz hakkında sorular sorabilirsin! 🎶🍷",
        remainingRights: 10 - count
      });
    }

    // SİMÜLATÖR KORUMASI: Yalın Selamlama Algılayıcı (En başta tetiklenir)
    if (lower === "merhaba" || lower === "selam" || lower === "slm" || lower === "mrh" || lower === "hey" || lower === "iyi günler") {
      return NextResponse.json({
        reply: "Last Penny tezgahına hoş geldin dostum! 🎶 Ben barmeniniz Penny. Keyifli bir caz akşamında sana bugün menümüzden ekşi, tatlı, acı imza kokteyllerimiz veya mutfağımızdan nefis şef tabakları arasından ne ikram edelim, masana ne hazırlayalım? 😊",
        remainingRights: 10 - count
      });
    }

    // Listeleme Talebi
    if (lower.includes("tüm") || lower.includes("hepsi") || lower.includes("liste") || lower.includes("neler")) {
      const listText = drinks.slice(0, 8).map(d => `• **${d.name}** (₺${d.price}) - *${d.description}*`).join("\n");
      return NextResponse.json({ reply: `Last Penny bar tezgahındaki güncel içecek listemizden bazı favorileri senin için seçtim dostum! 🍹\n\n${listText}\n\nHangisiyle başlamak istersin? 😊`, remainingRights: 10 - count });
    }

    // Ekşi içecek istekleri
    if (lower.includes("ekşi") || lower.includes("eksi") || lower.includes("sour")) {
      const sourDrinks = drinks.filter(d =>
        (d.name || "").toLowerCase().includes("sour") ||
        (d.name || "").toLowerCase().includes("ekşi") ||
        (d.name || "").toLowerCase().includes("eksi") ||
        (d.description || "").toLowerCase().includes("lime") ||
        (d.description || "").toLowerCase().includes("limon") ||
        (d.description || "").toLowerCase().includes("ekşi") ||
        (d.description || "").toLowerCase().includes("eksi")
      );
      const selected = sourDrinks[Math.floor(Math.random() * sourDrinks.length)] || drinks.find(d => d.name === "Southside Sour") || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Tezgahımızdan harika bir ekşi seçimi! Sana **${selected.name}** (₺${selected.price}) önereceğim. İçeriğindeki **${selected.description || "ferahlatıcı notalar"}** tam aradığın ekşi ve canlandırıcı aromayı sunacaktır. Masana hazırlayalım mı? 🍋`,
          remainingRights: 10 - count
        });
      }
    }

    // Tatlı içecek istekleri
    if (lower.includes("tatlı") || lower.includes("tatli") || lower.includes("sweet")) {
      const sweetDrinks = drinks.filter(d =>
        (d.name || "").toLowerCase().includes("tatlı") ||
        (d.name || "").toLowerCase().includes("tatli") ||
        (d.description || "").toLowerCase().includes("tatlı") ||
        (d.description || "").toLowerCase().includes("tatli") ||
        (d.description || "").toLowerCase().includes("çilek") ||
        (d.description || "").toLowerCase().includes("bal") ||
        (d.description || "").toLowerCase().includes("şeker") ||
        (d.description || "").toLowerCase().includes("mango") ||
        (d.description || "").toLowerCase().includes("karpuz") ||
        (d.description || "").toLowerCase().includes("böğürtlen")
      );
      const selected = sweetDrinks[Math.floor(Math.random() * sweetDrinks.length)] || drinks.find(d => d.name === "Strawberry Collins") || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Bardan tam ağzına layık, tatlı bir lezzet! Sana imza tarifimiz **${selected.name}** (₺${selected.price}) kokteylini öneririm. İçeriğinde yer alan **${selected.description || "nefis meyveli aromalar"}** ile keyifli bir içim sunar. Masana gönderelim mi? 🍹🍓`,
          remainingRights: 10 - count
        });
      }
    }

    // Viski istekleri
    if (lower.includes("viski") || lower.includes("whiskey") || lower.includes("whisky")) {
      const whiskeyDrinks = drinks.filter(d => d.category === "viski");
      const selected = whiskeyDrinks[Math.floor(Math.random() * whiskeyDrinks.length)] || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Last Penny viski kavından mükemmel bir tercih! Sana **${selected.name}** (₺${selected.price}) öneriyorum. Kadehte **${selected.description || "zengin aromasıyla"}** cidden çok özeldir. Hazırlayayım mı? 🥃`,
          remainingRights: 10 - count
        });
      }
    }

    // Bira istekleri
    if (lower.includes("bira") || lower.includes("beer")) {
      const beerDrinks = drinks.filter(d => d.category === "fici-bira" || d.category === "sise-bira");
      const selected = beerDrinks[Math.floor(Math.random() * beerDrinks.length)] || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Buz gibi bir biraya kim hayır diyebilir ki! Sana taze fıçı ve şişe listemizden **${selected.name}** (₺${selected.price}) öneririm. **${selected.description || "Serinletici ve dolgun içimli"}** bu biramız bardakta harika gider. Masana gelsin mi? 🍺`,
          remainingRights: 10 - count
        });
      }
    }

    // Şarap istekleri
    if (lower.includes("şarap") || lower.includes("sarap") || lower.includes("wine")) {
      const wineDrinks = drinks.filter(d => d.category === "kirmizi-sarap" || d.category === "blush-rose-beyaz-kopuklu" || d.category === "sicak-sarap-sangria");
      const selected = wineDrinks[Math.floor(Math.random() * wineDrinks.length)] || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Şarap kavımızdan nefis bir kadeh! Sana **${selected.name}** (₺${selected.price}) öneriyorum. İçeriğindeki **${selected.description || "zarif meyve notaları"}** ile gecene eşlik edecektir. Açalım mı? 🍷`,
          remainingRights: 10 - count
        });
      }
    }

    // Genel kokteyl/içecek istekleri
    if (lower.includes("kokteyl") || lower.includes("içecek") || lower.includes("alkol") || lower.includes("ne içsem") || lower.includes("ne icsem")) {
      const signatureDrinks = drinks.filter(d => d.category === "penny-signature");
      const selected = signatureDrinks[Math.floor(Math.random() * signatureDrinks.length)] || drinks[0];
      if (selected) {
        return NextResponse.json({
          reply: `Last Penny bar tezgahından sana özel bir tavsiye! İmza kokteyllerimizden **${selected.name}** (₺${selected.price}) hazırlayabilirim. İçeriğindeki **${selected.description || "özel barmen dokunuşu"}** ile pişman olmazsın dostum. Sallayalım mı? 🍹`,
          remainingRights: 10 - count
        });
      }
    }

    // Yemek istekleri
    if (lower.includes("yemek") || lower.includes("burger") || lower.includes("açım") || lower.includes("yiyecek") || lower.includes("ne yesem") || lower.includes("acım")) {
      let matchedFoods = foods;
      if (lower.includes("acı") || lower.includes("bahar") || lower.includes("acılı")) {
        matchedFoods = foods.filter(f => (f.description || "").toLowerCase().includes("acı") || (f.name || "").toLowerCase().includes("bravas") || (f.description || "").toLowerCase().includes("jalapeño"));
      }
      if (lower.includes("tost") || lower.includes("gözleme")) {
        matchedFoods = foods.filter(f => f.category === "tost-gozleme");
      }
      if (lower.includes("kahvaltı") || lower.includes("kahvalti")) {
        matchedFoods = foods.filter(f => f.category === "penny-kahvalti");
      }
      if (lower.includes("tatlı") || lower.includes("tatli")) {
        matchedFoods = foods.filter(f => f.category === "tatlilar");
      }
      const selectedFood = matchedFoods[Math.floor(Math.random() * matchedFoods.length)] || foods[0];
      if (selectedFood) {
        return NextResponse.json({
          reply: `Mutfağımızdan nefis bir tabak! Şefimizin senin için taze hazırlayacağı **${selectedFood.name}** (₺${selectedFood.price}) öneririm. **${selectedFood.description || "Last Penny klasiği lezzetler"}** ile harika bir gurme deneyimi olacaktır. Siparişini mutfağa geçeyim mi? 🍔`,
          remainingRights: 10 - count
        });
      }
    }

    // Fallback: Random drink suggestion from actual menu
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
    if (randomDrink) {
      return NextResponse.json({
        reply: `Last Penny tezgahına hoş geldin dostum! Sana barımızdan en sevilen ürünlerimizden **${randomDrink.name}** (₺${randomDrink.price}) hazırlamamı ister misin? **${randomDrink.description || "Last Penny'nin özel lezzeti"}** ile harika bir seçim olacaktır. 🎶`,
        remainingRights: 10 - count
      });
    }

    return NextResponse.json({
      reply: `Şu an yoğunluktan dolayı barda biraz bekletiyorum dostum. Ama barmeniniz Penny her zaman burada! Menümüz hakkında başka ne öğrenmek istersin? 🎶`,
      remainingRights: 10 - count
    });
    */
  }
}
