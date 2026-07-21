"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* Decorative Blobs */}
      <div className="absolute left-10 top-40 h-32 w-32 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="absolute right-10 top-20 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="container-custom relative flex flex-col items-center px-6 py-28 text-center">

        {/* Badge */}
        <div className="mb-8 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-sm font-semibold text-violet-700 shadow-sm">
          ✨ AI Powered Interview Preparation
        </div>

        {/* Heading */}
        <h1 className="font-display max-w-5xl text-5xl font-semibold leading-tight text-gray-900 md:text-7xl">

          Crack your

          <span className="text-gradient">
            {" "}dream interview{" "}
          </span>

          with AI-powered mock sessions.

        </h1>

        {/* Subtitle */}

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-500 md:text-xl">
          Practice technical interviews, receive intelligent AI feedback,
          improve your communication skills, and build the confidence
          to ace your next placement interview.
        </p>

        {/* Buttons */}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">

          <Link href="/interview/new">

            <button className="rounded-xl bg-gradient-primary px-8 py-4 text-lg font-medium text-white shadow-purple transition duration-300 hover:scale-105">

              🚀 Start Interview

            </button>

          </Link>

          <Link href="/dashboard">

            <button className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-medium shadow-soft transition hover:border-violet-300 hover:bg-violet-50">

              📊 View Dashboard

            </button>

          </Link>

        </div>

        {/* Stats */}

        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">

          <div className="glass-card rounded-3xl p-8 shadow-soft hover-lift">

            <h2 className="text-4xl font-bold text-violet-600">
              AI
            </h2>

            <p className="mt-2 text-gray-500">
              Instant Feedback
            </p>

          </div>

          <div className="glass-card rounded-3xl p-8 shadow-soft hover-lift">

            <h2 className="text-4xl font-bold text-violet-600">
              100+
            </h2>

            <p className="mt-2 text-gray-500">
              Interview Questions
            </p>

          </div>

          <div className="glass-card rounded-3xl p-8 shadow-soft hover-lift">

            <h2 className="text-4xl font-bold text-violet-600">
              24×7
            </h2>

            <p className="mt-2 text-gray-500">
              Practice Anytime
            </p>

          </div>

          <div className="glass-card rounded-3xl p-8 shadow-soft hover-lift">

            <h2 className="text-4xl font-bold text-violet-600">
              ∞
            </h2>

            <p className="mt-2 text-gray-500">
              Unlimited Practice
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}