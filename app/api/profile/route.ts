import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import InterviewSession from "@/models/InterviewSession";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

   const decoded = verifyToken(token) as { userId: string };

console.log("Decoded Token:", decoded);

    await connectDB();

    console.log("Searching User ID:", decoded.userId);

const user = await User.findById(decoded.userId).select(
  "name email createdAt"
);

console.log("User Found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const sessions = await InterviewSession.find({
      userId: decoded.userId,
    });

    let totalInterviews = sessions.length;
    let bestScore = 0;
    let averageScore = 0;

    let total = 0;
    let count = 0;

    sessions.forEach((session) => {
      session.answers.forEach((answer: any) => {
        total += answer.score || 0;
        count++;

        if ((answer.score || 0) > bestScore) {
          bestScore = answer.score;
        }
      });
    });

    if (count > 0) {
      averageScore = Number((total / count).toFixed(1));
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      joined: user.createdAt,
      totalInterviews,
      averageScore,
      bestScore,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}