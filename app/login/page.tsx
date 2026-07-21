"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
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

console.log("Login Success");
console.log(data);

localStorage.setItem("userId", data.user.id);

console.log("Going to interview page...");

router.push("/interview/new");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left Section */}

      <div className="hidden lg:flex relative overflow-hidden items-center justify-center bg-gradient-primary">

        <div className="absolute h-96 w-96 rounded-full bg-white/10 blur-3xl top-10 left-10" />

        <div className="absolute h-80 w-80 rounded-full bg-pink-300/20 blur-3xl bottom-10 right-10" />

        <div className="relative z-10 max-w-md text-white px-10">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
            AI Powered Platform
          </span>

          <h1 className="font-display mt-8 text-6xl leading-tight">

            Welcome
            <br />
            Back.

          </h1>

          <p className="mt-6 text-lg text-white/80 leading-8">

            Continue your interview preparation with
            AI-generated questions, instant feedback,
            and performance tracking.

          </p>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex items-center justify-center px-6 py-16 bg-white">

        <div className="w-full max-w-md">

          <h2 className="font-display text-4xl font-semibold mb-2">

            Log In

          </h2>

          <p className="text-gray-500 mb-10">

            Welcome back! Continue your AI interview journey.

          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

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
                placeholder="Enter your password"
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
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-primary py-3 text-lg font-semibold text-white shadow-purple transition hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

          </form>

          <p className="mt-8 text-center text-gray-500">

            Don't have an account?{" "}

            <Link
              href="/signup"
              className="font-semibold text-violet-600 hover:underline"
            >
              Create one
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}