import authOption from "@/lib/auth";
import { ConnectionDb } from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await ConnectionDb();

    const session = await getServerSession(authOption);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in to continue." },
        { status: 401 },
      );
    }

    const user =
      ((session.user.id ? await User.findById(session.user.id) : null) ||
        (await User.findOne({ email: session.user.email })))
        ?.toObject?.() ||
      (await User.findOne({ email: session.user.email }));

    if (!user) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 },
      );
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User profile retrieved successfully.", user: userWithoutPassword },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API /api/user error:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching user profile." },
      { status: 500 },
    );
  }
}
