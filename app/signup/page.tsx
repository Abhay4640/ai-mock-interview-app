"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      localStorage.setItem("userId", data.user.id);

      router.push("/interview/new");
    } catch {
      setLoading(false);
      setError("Network or Server Error");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left Section */}

      <div className="hidden lg:flex relative overflow-hidden items-center justify-center bg-gradient-primary">

        <div className="absolute h-96 w-96 rounded-full bg-white/10 blur-3xl top-10 left-10" />

        <div className="absolute h-80 w-80 rounded-full bg-pink-300/20 blur-3xl bottom-10 right-10" />

        <div className="relative z-10 max-w-md px-10 text-white">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
            Join InterviewAI
          </span>

          <h1 className="font-display mt-8 text-6xl leading-tight">
            Build Your
            <br />
            Future.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80">
            Create your account and start practicing technical interviews
            with AI-generated questions, personalized feedback, and detailed
            performance insights.
          </p>

          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <span>Unlimited Mock Interviews</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <span>Instant AI Feedback</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                ✓
              </div>
              <span>Performance Dashboard</span>
            </div>

          </div>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex items-center justify-center bg-white px-6 py-16">

        <div className="w-full max-w-md">

          <h2 className="font-display mb-2 text-4xl font-semibold">
            Create Account
          </h2>

          <p className="mb-10 text-gray-500">
            Start your AI interview preparation today.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Abhay Thakur"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-primary py-3 text-lg font-semibold text-white shadow-purple transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-600 hover:underline"
            >
              Log In
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}