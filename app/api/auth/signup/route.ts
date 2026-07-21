import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    console.log("========== SIGNUP API START ==========");

    const { name, email, password } = await req.json();
    console.log("Received Data:", { name, email });

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB Connected ✅");

    console.log("Checking existing user...");
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Email already exists");
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User Created:", user._id);

    console.log("Signing JWT...");
    const token = signToken({
      userId: user._id.toString(),
    });

    console.log("JWT Created");

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("========== SIGNUP SUCCESS ==========");

    return response;
  } catch (error) {
    console.error("========== SIGNUP ERROR ==========");
    console.error(error);

    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Unknown Server Error",
      },
      { status: 500 }
    );
  }
}