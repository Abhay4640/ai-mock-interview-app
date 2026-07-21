import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InterviewSession from "@/models/InterviewSession";
import { generateWithGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { sessionId, question, answer } = await req.json();

    if (!sessionId || !question || !answer) {
      return NextResponse.json({ error: "sessionId, question and answer are required" }, { status: 400 });
    }

    await connectDB();

    const prompt = `You are an interview coach. A candidate was asked: "${question}"
They answered: "${answer}"

Give feedback in ONLY this JSON format, no markdown, no explanation outside the JSON:
{"score": <number 0-10>, "feedback": "<2-3 sentences of constructive feedback>"}`;

    const raw = await generateWithGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);
    console.log("Groq Response:", result);

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    session.answers.push({
      question,
      answer,
      feedback: result.feedback,
      score: result.score,
    });
    await session.save();

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong", details: String(err) }, { status: 500 });
  }
}