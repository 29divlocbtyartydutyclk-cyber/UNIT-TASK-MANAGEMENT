"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { ROLES } from "@/lib/auth/session";

export default function LoginPage() {
  const [role, setRole] = useState<string>("Viewer");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(role, password);
    setSubmitting(false);
    if (result && !result.success) {
      setError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D4DE95] px-4">
      <div className="w-full max-w-sm rounded-lg border border-combat-900 bg-combat-800 p-6 shadow-lg">
        <h1 className="text-center text-lg font-bold uppercase tracking-wide text-sand-50">
          Unit Task Management
        </h1>
        <p className="mt-1 text-center text-sm text-sand-300">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-sand-200">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-combat-600 bg-sand-50 px-3 py-2 text-sm text-sand-900 focus:border-combat-400 focus:outline-none focus:ring-1 focus:ring-combat-400"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-sand-200">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-combat-600 bg-sand-50 px-3 py-2 text-sm text-sand-900 focus:border-combat-400 focus:outline-none focus:ring-1 focus:ring-combat-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-combat-500 px-4 py-2 text-sm font-semibold text-white hover:bg-combat-400 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-sand-300 hover:text-sand-100">
            &larr; Back to app selection
          </Link>
        </p>
      </div>
    </div>
  );
}
