const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Last Penny <onboarding@resend.dev>";

// Resend ücretsiz planda domain doğrulaması olmadan
// sadece hesap sahibi mailine gönderilebilir.
// Kendi domain'ini resend.com'a ekleyince bu env'i kaldır.
const TO_OVERRIDE = process.env.RESEND_TO_OVERRIDE;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY bulunamadı, mail gönderilmedi");
    return false;
  }

  // Override varsa oraya gönder, subject'e gerçek alıcıyı yaz
  const finalTo = TO_OVERRIDE || to;
  const finalSubject = TO_OVERRIDE ? `[Test → ${to}] ${subject}` : subject;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: finalTo,
        subject: finalSubject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend hatası:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Mail gönderilemedi:", err);
    return false;
  }
}

/* ── Hoş Geldin Maili (Kayıt) ─────────────────────────────────── */
export function buildWelcomeEmail(name: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Last Penny'ye Hoş Geldin</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;border:1px solid #222;overflow:hidden;max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a0a00 0%,#0a0a0a 100%);padding:40px 40px 32px;text-align:center;border-bottom:1px solid #2a1a00;">
            <div style="display:inline-block;background:linear-gradient(135deg,#d4a853,#e8c47a);width:56px;height:56px;border-radius:50%;line-height:56px;font-size:24px;margin-bottom:16px;">🎵</div>
            <h1 style="margin:0;color:#d4a853;font-size:28px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Last Penny</h1>
            <p style="margin:6px 0 0;color:#888;font-size:12px;letter-spacing:4px;text-transform:uppercase;">Büklüm · Ankara · Kavaklıdere</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 16px;color:#f0f0f0;font-size:22px;font-weight:600;">Merhaba, ${name}! 👋</h2>
            <p style="margin:0 0 20px;color:#aaa;font-size:15px;line-height:1.7;">
              Last Penny ailesine katıldığın için çok mutluyuz. Ankara'nın kalbindeki bu küçük sahne seni bekliyor.
            </p>
            <p style="margin:0 0 32px;color:#aaa;font-size:15px;line-height:1.7;">
              Canlı müzik etkinliklerinden haberdar olmak, menümüzü keşfetmek ve merch siparişi vermek için hesabını kullanabilirsin.
            </p>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display:inline-block;background:#d4a853;color:#0a0a0a;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                Siteye Git →
              </a>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:48%;padding:16px;background:#1a1a1a;border-radius:10px;border:1px solid #252525;vertical-align:top;">
                  <p style="margin:0 0 6px;color:#d4a853;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Adres</p>
                  <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;">Büklüm Cd No:41/A<br>Kavaklıdere, Ankara</p>
                </td>
                <td style="width:4%;"></td>
                <td style="width:48%;padding:16px;background:#1a1a1a;border-radius:10px;border:1px solid #252525;vertical-align:top;">
                  <p style="margin:0 0 6px;color:#d4a853;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Saat</p>
                  <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;">Her gün açık<br>Kapanış: 01:00</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="margin:0;color:#555;font-size:12px;line-height:1.6;">
              Bu maili <strong style="color:#777">${name}</strong> olarak kayıt olduğun için aldın.<br>
              © 2026 Last Penny · Ankara
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Giriş Bildirimi Maili (Login) ────────────────────────────── */
export function buildLoginEmail(name: string): string {
  const now = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Giriş Bildirimi</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;border:1px solid #222;overflow:hidden;max-width:560px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#1a0a00 0%,#0a0a0a 100%);padding:32px 40px;text-align:center;border-bottom:1px solid #2a1a00;">
            <h1 style="margin:0;color:#d4a853;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Last Penny</h1>
            <p style="margin:6px 0 0;color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Giriş Bildirimi</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;color:#f0f0f0;font-size:16px;">Merhaba, <strong>${name}</strong> 👋</p>
            <p style="margin:0 0 28px;color:#aaa;font-size:15px;line-height:1.7;">
              Hesabına yeni bir giriş yapıldı. Bu sen değilsen lütfen şifreni hemen değiştir.
            </p>
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #d4a853;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
              <p style="margin:0 0 8px;color:#888;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Giriş Zamanı</p>
              <p style="margin:0;color:#d4a853;font-size:16px;font-weight:600;">${now}</p>
            </div>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">
              Bu giriş sana aittiyse bu maili görmezden gelebilirsin. 🎵
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="margin:0;color:#444;font-size:12px;">© 2026 Last Penny · Ankara</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}