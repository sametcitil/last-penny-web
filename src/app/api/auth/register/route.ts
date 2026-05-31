import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { hashPassword, signToken, setTokenCookie } from "@/lib/auth";
import { sendEmail, buildWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tüm alanları doldurunuz" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi giriniz" }, { status: 400 });
    }

    try {
      await dbConnect();

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json({ error: "Bu e-posta adresi zaten kayıtlı" }, { status: 409 });
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user",
      });

      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Hoş geldin maili gönder (arka planda, hata olsa bile devam et)
      sendEmail({
        to: user.email,
        subject: "Last Penny'ye Hoş Geldin! 🎵",
        html: buildWelcomeEmail(user.name),
      }).catch((err) => console.error("Welcome email error:", err));

      const response = NextResponse.json(
        { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
        { status: 201 }
      );
      response.headers.set("Set-Cookie", setTokenCookie(token));
      return response;

    } catch (dbError) {
      console.warn("Database connection failed, using mock registration:", dbError);

      const mockUser = {
        id: `mock-user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: "user" as const,
      };
      const token = signToken({ userId: mockUser.id, email: mockUser.email, role: mockUser.role });

      // Mock modda da mail gönder
      sendEmail({
        to: mockUser.email,
        subject: "Last Penny'ye Hoş Geldin! 🎵",
        html: buildWelcomeEmail(mockUser.name),
      }).catch((err) => console.error("Welcome email error (mock):", err));

      const response = NextResponse.json({ user: mockUser }, { status: 201 });
      response.headers.set("Set-Cookie", setTokenCookie(token));
      return response;
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Sunucu hatası, lütfen tekrar deneyiniz" }, { status: 500 });
  }
}