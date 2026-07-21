import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectDB();

    const sessions = await InterviewSession.find({ userId }).sort({ createdAt: -1 });

    const formatted = sessions.map((s) => {
      const scores = s.answers.map((a: any) => a.score).filter((n: any) => typeof n === "number");
      const avgScore = scores.length
        ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
        : "N/A";

      return {
        id: s._id,
        role: s.role,
        date: s.createdAt,
        totalQuestions: s.questions.length,
        answered: s.answers.length,
        avgScore,
      };
    });

    return NextResponse.json({ sessions: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong", details: String(err) }, { status: 500 });
  }
}