import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function generateWithGroq(prompt: string) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-20b",
  });

  return completion.choices[0]?.message?.content || "";
}