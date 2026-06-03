import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import MenuItem from "@/lib/models/MenuItem";
import Event from "@/lib/models/Event";
import Product from "@/lib/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    await dbConnect();

    const [totalUsers, totalMenuItems, totalEvents, totalProducts] = await Promise.all([
      User.countDocuments(),
      MenuItem.countDocuments(),
      Event.countDocuments(),
      Product.countDocuments(),
    ]);

    // Format matches the DashboardStats interface expected by the client:
    // interface DashboardStats {
    //   totalUsers: number;
    //   totalMenuItems: number;
    //   totalEvents: number;
    //   totalProducts: number;
    //   recentActivity: Array<{ type: string; message: string; time: string }>;
    // }
    return NextResponse.json({
      stats: {
        totalUsers,
        totalMenuItems,
        totalEvents,
        totalProducts,
        recentActivity: [],
      }
    });
  } catch (err: any) {
    console.error("[GET /api/dashboard/stats] DB Error:", err);
    return NextResponse.json(
      { error: "Veriler veritabanından okunamadı", details: err?.message },
      { status: 500 }
    );
  }
}
