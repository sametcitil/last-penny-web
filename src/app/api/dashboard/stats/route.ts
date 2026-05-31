import { NextResponse } from "next/server";
import { mockDashboardStats } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  return NextResponse.json({ stats: mockDashboardStats });
}
