"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("userId");

    router.push("/login");
  }

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      pathname === path
        ? "bg-violet-600 text-white"
        : "text-gray-600 hover:bg-violet-100 hover:text-violet-700"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-violet-600">
            AI Interview Analyzer
          </h1>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className={linkStyle("/dashboard")}>
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              className={linkStyle("/dashboard/profile")}
            >
              Profile
            </Link>

            <Link
              href="/interview/new"
              className={linkStyle("/interview/new")}
            >
              New Interview
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}