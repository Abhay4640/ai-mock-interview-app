"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InterviewDetailsPage() {
  const { sessionId } = useParams();

  const [session, setSession] = useState<any>(null);
  const averageScore =
  session?.answers?.length > 0
    ? (
        session.answers.reduce(
          (sum: number, item: any) => sum + Number(item.score || 0),
          0
        ) / session.answers.length
      ).toFixed(1)
    : "0";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
   async function fetchSession() {
   try {
   
    console.log("Fetching session:", sessionId);

    const res = await fetch(`/api/interview/session/${sessionId}`);

    console.log("Status:", res.status);

    const data = await res.json();

    console.log("Data:", data);

    setSession(data);
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setLoading(false);
  }
}

  if (sessionId) fetchSession();
}, [sessionId]);

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

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Interview not found.
      </div>
    );
  }

  console.log("Session:", session);
  console.log("Answers:", session.answers);

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-2 text-4xl font-bold">
          {session.role}
        </h1>

        <div className="mb-10 rounded-3xl bg-white p-8 shadow-lg">

  <h1 className="text-4xl font-bold">
    {session.role}
  </h1>

  <p className="mt-2 text-gray-500">
    {new Date(session.createdAt).toLocaleString()}
  </p>

  <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">

    <div className="rounded-2xl bg-violet-50 p-5">
      <p className="text-gray-500">Average Score</p>
      <h2 className="mt-2 text-3xl font-bold text-violet-600">
        {averageScore}/10
      </h2>
    </div>

    <div className="rounded-2xl bg-green-50 p-5">
      <p className="text-gray-500">Questions</p>
      <h2 className="mt-2 text-3xl font-bold text-green-600">
        {session.answers.length}
      </h2>
    </div>

    <div className="rounded-2xl bg-yellow-50 p-5">
      <p className="text-gray-500">Highest Score</p>
      <h2 className="mt-2 text-3xl font-bold text-yellow-600">
        {Math.max(...session.answers.map((a: any) => Number(a.score || 0)))}
      </h2>
    </div>

    <div className="rounded-2xl bg-blue-50 p-5">
      <p className="text-gray-500">Performance</p>

      <h2 className="mt-2 text-2xl font-bold text-blue-600">
        {Number(averageScore) >= 9
          ? "🏆 Excellent"
          : Number(averageScore) >= 7
          ? "🟢 Good"
          : Number(averageScore) >= 5
          ? "🟡 Average"
          : "🔴 Needs Work"}
      </h2>

    </div>

  </div>

</div>

        {session.answers.map((item: any, index: number) => (
          <div
            key={index}
            className="mb-8 rounded-2xl bg-white p-6 shadow"
          >
            <h2 className="mb-4 text-xl font-bold">
              Question {index + 1}
            </h2>

            <p className="mb-4">
              <strong>Question:</strong><br />
              {item.question}
            </p>

            <p className="mb-4">
              <strong>Your Answer:</strong><br />
              {item.answer}
            </p>

            <p className="mb-4">
              <strong>AI Feedback:</strong><br />
              {item.feedback}
            </p>

            <div className="inline-block rounded-lg bg-violet-100 px-4 py-2 font-bold text-violet-700">
              Score: {item.score}/10
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}