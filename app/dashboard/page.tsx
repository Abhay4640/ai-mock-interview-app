"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PerformanceChart from "../../components/PerformanceChart";

type Session = {
  id: string;
  role: string;
  date: string;
  totalQuestions: number;
  answered: number;
  avgScore: string | number;
};

export default function DashboardPage() {
  const router = useRouter();
  async function handleDelete(id: string) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this interview?"
  );

  if (!confirmDelete) return;

  const res = await fetch("/api/interview/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();

  if (!res.ok) {
  toast.error(data.error || "Failed to delete interview");
  return;
}

  setSessions((prev) =>
  prev.filter((session) => session.id !== id)
);

toast.success("Interview deleted successfully!");

}
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState({
  name: "",
  email: "",
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  async function handleLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  localStorage.removeItem("userId");

  router.push("/login");
}

  useEffect(() => {
    async function fetchUser() {
  const res = await fetch("/api/auth/me");

  if (!res.ok) return;

  const data = await res.json();

  setUser(data);
}
    async function fetchHistory() {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("Please log in first");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/interview/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSessions(data.sessions);
    }

       fetchUser();
    fetchHistory();
}, []);

  const stats = useMemo(() => {
    const total = sessions.length;

    const validScores = sessions
  .map((s) => Number(s.avgScore))
  .filter((score) => !isNaN(score));

const best =
  validScores.length > 0
    ? Math.max(...validScores)
    : 0;

const average =
  validScores.length > 0
    ? (
        validScores.reduce((sum, score) => sum + score, 0) /
        validScores.length
      ).toFixed(1)
    : "0";

    const totalQuestionsAnswered = sessions.reduce(
  (sum, s) => sum + s.answered,
  0
);

    return {
      total,
      best,
      average,
      totalQuestionsAnswered,
    };
  }, [sessions]);

  if (loading)
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-custom px-6 py-12 animate-pulse">

        {/* Header */}
        <div className="mb-10 flex justify-between items-center">

          <div>
            <div className="h-10 w-72 rounded bg-gray-300"></div>

            <div className="mt-4 h-4 w-96 rounded bg-gray-200"></div>
          </div>

          <div className="h-12 w-44 rounded-xl bg-gray-300"></div>

        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white p-7 shadow"
            >
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>

              <div className="mt-5 h-4 w-24 rounded bg-gray-200"></div>

              <div className="mt-4 h-10 w-20 rounded bg-gray-300"></div>
            </div>
          ))}

        </div>

        {/* Interview Cards */}

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">

          <div className="mb-8 h-8 w-56 rounded bg-gray-300"></div>

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="mb-5 rounded-2xl border p-6"
            >
              <div className="h-6 w-48 rounded bg-gray-300"></div>

              <div className="mt-4 h-4 w-40 rounded bg-gray-200"></div>

              <div className="mt-3 h-4 w-60 rounded bg-gray-200"></div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="container-custom px-6 py-12">

        {/* Heading */}

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="font-display text-5xl">
  Welcome back, {user.name || "User"} 👋
</h1>

<p className="mt-3 text-gray-500">
  Ready for your next AI interview? Let's improve your skills today.
</p>

          </div>

    

        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Interviews"
            value={stats.total}
            icon="🎯"
          />

          <StatCard
            title="Average Score"
            value={`${stats.average}/10`}
            icon="📈"
          />

          <StatCard
            title="Best Score"
            value={`${stats.best}/10`}
            icon="🏆"
          />

          <StatCard
            title="Questions Answered"
            value={stats.totalQuestionsAnswered}
             icon="❓"
          />

        </div>

          </div>

        {/* Performance Chart */}

        <div className="mt-10">
          <PerformanceChart sessions={sessions} />
        </div>

        {/* Recent */}

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-soft">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="font-display text-3xl">
              Recent Interviews
            </h2>

            <span className="text-sm text-gray-400">
              {sessions.length} Sessions
            </span>

          </div>

          {sessions.length === 0 ? (
  <div className="rounded-3xl border-2 border-dashed border-violet-300 bg-violet-50 p-16 text-center">

    <div className="mb-6 text-7xl">
      🎯
    </div>

    <h3 className="text-3xl font-bold text-gray-800">
      No Interviews Yet
    </h3>

    <p className="mt-4 text-gray-500">
      Start your first AI interview and begin tracking your performance.
    </p>

    <Link href="/interview/new">
      <button className="mt-8 rounded-xl bg-gradient-primary px-8 py-3 font-semibold text-white shadow-purple transition hover:scale-105">
        🚀 Start First Interview
      </button>
    </Link>

  </div>
) : (

            <div className="space-y-5">

              {sessions.map((session) => (
                <Link
  href={`/dashboard/interview/${session.id}`}
  key={session.id}
>
  <div className="rounded-2xl border border-gray-200 p-6 transition hover:border-violet-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        {session.role}
                      </h3>

                      <p className="mt-2 text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {session.answered} / {session.totalQuestions} Questions Completed
                      </p>

                    </div>

                    <div className="text-left md:text-right">

  <div className="text-4xl font-bold text-violet-600">
    {session.avgScore}
  </div>

  <div className="text-gray-500 mb-4">
    Average Score
  </div>

  <button
    onClick={(e) => {
      e.preventDefault();
      handleDelete(session.id);
    }}
    className="rounded-lg border border-red-300 px-4 py-2 text-red-600 transition hover:bg-red-50"
  >
    🗑 Delete
  </button>

</div>

                  </div>

                </div>

                  </Link> 
              ))}

                 </div>
               )}

            </div>

        </div>

   );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="glass-card rounded-3xl p-7 shadow-soft transition hover:-translate-y-2">

      <div className="text-3xl">{icon}</div>

      <h3 className="mt-5 text-gray-500">
        {title}
      </h3>

      <div className="mt-2 text-4xl font-bold">
        {value}
      </div>

    </div>
  );
}