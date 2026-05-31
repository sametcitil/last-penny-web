import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Çıkış yapıldı" });
  response.headers.set("Set-Cookie", clearTokenCookie());
  return response;
}
