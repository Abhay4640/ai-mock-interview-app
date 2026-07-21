"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Session = {
  id: string;
  role: string;
  date: string;
  totalQuestions: number;
  answered: number;
  avgScore: string | number;
};

export default function PerformanceChart({
  sessions,
}: {
  sessions: Session[];
}) {
  const data = sessions
    .slice()
    .reverse()
    .map((session, index) => {
      const score = Number(session.avgScore);

      return {
        name: `#${index + 1}`,
        score: Number.isFinite(score) ? score : 0,
      };
    });

  console.log("Chart Data:", data);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft">
      <h2 className="mb-6 text-2xl font-bold">
        📈 Performance Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="name" />

          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c3aed"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}