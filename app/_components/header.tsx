"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("userId");

    setUser(null);

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">
      <div className="container-custom flex h-20 items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-purple">
            <span className="text-lg font-bold text-white">AI</span>
          </div>

          <div>
            <h1 className="font-display text-2xl font-semibold">
              InterviewAI
            </h1>

            <p className="text-xs text-gray-500">
              AI Powered Interview Practice
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-600 transition hover:text-primary"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="text-gray-600 transition hover:text-primary"
          >
            Dashboard
          </Link>

          <Link
            href="/interview/new"
            className="text-gray-600 transition hover:text-primary"
          >
            New Interview
          </Link>
        </nav>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">
              👤 {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-300 px-5 py-2 font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="rounded-xl bg-gradient-primary px-6 py-3 font-medium text-white shadow-purple transition hover:scale-105">
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}