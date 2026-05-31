import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      await dbConnect();
      const user = await User.findById(payload.userId).select("-password");

      if (user) {
        return NextResponse.json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    } catch (dbError) {
      console.warn("Database connection failed, falling back to cookie payload:", dbError);
    }

    // Fallback: If DB is down, return payload directly
    return NextResponse.json({
      user: {
        id: payload.userId,
        name: payload.email.split("@")[0],
        email: payload.email,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

