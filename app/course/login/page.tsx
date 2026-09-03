"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { courseLogin } from "@/app/actions/course-auth";

export default function CourseLoginPage() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await courseLogin({ serviceNumber, password });
      if (result && !result.success) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-study-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-study-800 mb-1">E Pre Course</h1>
        <p className="text-sm text-parchment-600 mb-6">Sign in with your service number</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Service Number</label>
            <input
              type="text"
              value={serviceNumber}
              onChange={(e) => setServiceNumber(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-study-600 text-white py-2 text-sm font-medium hover:bg-study-700 disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-parchment-600">
          New here?{" "}
          <Link href="/course/register" className="text-study-700 font-medium">
            Register
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link href="/" className="text-parchment-500">
            &larr; Back to app selection
          </Link>
        </p>
      </div>
    </main>
  );
}
