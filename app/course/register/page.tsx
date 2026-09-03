"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { courseRegister } from "@/app/actions/course-auth";
import { COURSE_CATEGORIES, COURSE_CATEGORY_LABELS, type CourseCategoryValue } from "@/lib/course/constants";

export default function CourseRegisterPage() {
  const [serviceNumber, setServiceNumber] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState<CourseCategoryValue | "">("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!category) {
      setError("Select your category");
      return;
    }
    startTransition(async () => {
      const result = await courseRegister({ serviceNumber, name, rank, category, password });
      if (result && !result.success) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-study-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-study-800 mb-1">Register</h1>
        <p className="text-sm text-parchment-600 mb-6">
          Your account will need admin approval before you can sign in.
        </p>

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
            <label className="block text-sm font-medium text-parchment-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Rank (optional)</label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CourseCategoryValue)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {COURSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {COURSE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-study-400"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-study-600 text-white py-2 text-sm font-medium hover:bg-study-700 disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-parchment-600">
          Already have an account?{" "}
          <Link href="/course/login" className="text-study-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
