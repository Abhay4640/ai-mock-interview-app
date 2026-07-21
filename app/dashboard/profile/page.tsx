"use client";

import { useEffect, useState } from "react";

type Profile = {
  name: string;
  email: string;
  joined: string;
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>

        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Interview...
        </p>
      </div>
    </div>
  );
}

  if (!profile) {
    return (
      <div className="p-10 text-red-500">
        Something went wrong.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-5xl font-bold mb-10">
        👤 My Profile
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Name</p>
          <h2 className="text-3xl font-bold mt-2">
            {profile.name}
          </h2>
        </div>

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Email</p>
          <h2 className="text-2xl font-semibold mt-2">
            {profile.email}
          </h2>
        </div>

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Joined</p>
          <h2 className="text-2xl font-semibold mt-2">
            {new Date(profile.joined).toLocaleDateString()}
          </h2>
        </div>

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Total Interviews</p>
          <h2 className="text-4xl font-bold mt-2">
            {profile.totalInterviews}
          </h2>
        </div>

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Average Score</p>
          <h2 className="text-4xl font-bold mt-2 text-violet-600">
            {profile.averageScore}/10
          </h2>
        </div>

        <div className="rounded-3xl bg-white shadow p-8">
          <p className="text-gray-500">Best Score</p>
          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {profile.bestScore}/10
          </h2>
        </div>

      </div>

    </div>
  );
}