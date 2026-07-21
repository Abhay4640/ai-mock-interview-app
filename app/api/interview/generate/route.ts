import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { generateWithGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    console.log("========== GENERATE START ==========");

    const { role, userId } = await req.json();

    console.log("Role:", role);
    console.log("UserId:", userId);

    if (!role || !userId) {
      return NextResponse.json(
        { error: "role and userId are required" },
        { status: 400 }
      );
    }

    console.log("Connecting MongoDB...");
    await connectDB();
    console.log("MongoDB Connected");

    const prompt = `Generate exactly 5 mock interview questions for a ${role} position.

Return ONLY a JSON array.

Example:
[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5"
]`;

    console.log("Calling Groq...");

    const raw = await generateWithGroq(prompt);

    console.log("Raw Response:");
    console.log(raw);

    const cleaned = raw.replace(/```json|```/g, "").trim();

    console.log("Cleaned Response:");
    console.log(cleaned);

    const questions = JSON.parse(cleaned);

    console.log("Questions:");
    console.log(questions);

    const session = await InterviewSession.create({
      userId,
      role,
      questions,
      answers: [],
    });

    console.log("Session Created:", session._id);

    return NextResponse.json({
      sessionId: session._id,
      questions,
    });

  } catch (err) {
    console.error("========== GENERATE ERROR ==========");

    if (err instanceof Error) {
      console.error(err.message);
      console.error(err.stack);

      return NextResponse.json(
        {
          error: err.message,
        },
        { status: 500 }
      );
    }

    console.error(err);

    return NextResponse.json(
      {
        error: "Unknown Error",
      },
      { status: 500 }
    );
  }
}