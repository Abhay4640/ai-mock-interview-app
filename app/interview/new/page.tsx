"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const suggestedRoles = [
  "Frontend Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps Engineer",
];

export default function NewInterviewPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Please log in first");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          userId,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Save questions
      localStorage.setItem(
        `questions-${data.sessionId}`,
        JSON.stringify(data.questions)
      );

      // Save selected role
      localStorage.setItem(
        `role-${data.sessionId}`,
        role
      );

      router.push(`/interview/${data.sessionId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-400/10 blur-[120px]" />

      <div className="container-custom relative py-16 px-6">

        {/* Hero */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">
            ✨ AI Interview Generator
          </span>

          <h1 className="font-display mt-8 text-5xl leading-tight">
            Generate Your
            <span className="text-gradient"> AI Mock Interview</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-500">
            Enter your target job role and let AI generate realistic interview
            questions with instant evaluation and feedback.
          </p>

        </div>

        {/* Main Card */}

        <div className="glass-card mx-auto mt-14 max-w-3xl rounded-3xl p-10 shadow-soft">

          <form onSubmit={handleStart} className="space-y-8">

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-600">
                Target Job Role
              </label>

              <input
                type="text"
                placeholder="Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

            </div>

            {/* Suggested Roles */}

            <div>

              <p className="mb-4 text-sm font-semibold text-gray-600">
                Suggested Roles
              </p>

              <div className="flex flex-wrap gap-3">

                {suggestedRoles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className="rounded-full border border-violet-200 px-4 py-2 text-sm transition hover:bg-violet-100"
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {/* Features */}

            <div className="grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl bg-violet-50 p-5">
                <h3 className="font-semibold">🤖 AI Generated Questions</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Role-specific interview questions generated instantly.
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-5">
                <h3 className="font-semibold">⭐ Instant Feedback</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Get AI evaluation after every answer.
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-5">
                <h3 className="font-semibold">🎤 Voice Answer</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Practice speaking using built-in voice input.
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-5">
                <h3 className="font-semibold">📊 Performance Tracking</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Monitor your interview history and scores.
                </p>
              </div>

            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-primary py-4 text-lg font-semibold text-white shadow-purple transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Generating AI Interview..."
                : "🚀 Generate Interview"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}