import { ConnectionDb } from "@/lib/db";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await ConnectionDb();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return NextResponse.json(
        { message: "This email address is already registered. Please log in instead." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully.", user },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred while creating the account." },
      { status: 500 },
    );
  }
}
