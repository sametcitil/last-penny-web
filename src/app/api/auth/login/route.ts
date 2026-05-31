import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { comparePassword, signToken, setTokenCookie } from "@/lib/auth";
import { sendEmail, buildLoginEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase();

    try {
      await dbConnect();

      const user = await User.findOne({ email: lowerEmail });
      if (user) {
        const isValid = await comparePassword(password, user.password);
        if (isValid) {
          const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          });

          // Giriş bildirimi maili (arka planda)
          sendEmail({
            to: user.email,
            subject: "Last Penny — Yeni Giriş Bildirimi",
            html: buildLoginEmail(user.name),
          }).catch((err) => console.error("Login email error:", err));

          const response = NextResponse.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
          });
          response.headers.set("Set-Cookie", setTokenCookie(token));
          return response;
        }
      }
    } catch (dbError) {
      console.warn("Database connection failed, using mock auth:", dbError);
    }

    // Fallback: mock credentials
    if (password === "admin123" && lowerEmail === "admin@lastpenny.com") {
      const mockUser = { id: "mock-admin-id", name: "LP Admin", email: lowerEmail, role: "admin" as const };
      const token = signToken({ userId: mockUser.id, email: mockUser.email, role: mockUser.role });

      sendEmail({
        to: mockUser.email,
        subject: "Last Penny — Yeni Giriş Bildirimi",
        html: buildLoginEmail(mockUser.name),
      }).catch(() => {});

      const response = NextResponse.json({ user: mockUser });
      response.headers.set("Set-Cookie", setTokenCookie(token));
      return response;
    }

    if (password === "user123" && lowerEmail === "user@lastpenny.com") {
      const mockUser = { id: "mock-user-id", name: "LP User", email: lowerEmail, role: "user" as const };
      const token = signToken({ userId: mockUser.id, email: mockUser.email, role: mockUser.role });

      sendEmail({
        to: mockUser.email,
        subject: "Last Penny — Yeni Giriş Bildirimi",
        html: buildLoginEmail(mockUser.name),
      }).catch(() => {});

      const response = NextResponse.json({ user: mockUser });
      response.headers.set("Set-Cookie", setTokenCookie(token));
      return response;
    }

    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Sunucu hatası, lütfen tekrar deneyiniz" }, { status: 500 });
  }
}