import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Please define GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateWithGemini(prompt: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
}