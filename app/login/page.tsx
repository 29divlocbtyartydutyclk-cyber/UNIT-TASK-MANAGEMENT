"use client";

import { useState, type FormEvent } from "react";
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
    <div className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-sand-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-lg font-bold uppercase tracking-wide text-combat-800">
          Unit Task Management
        </h1>
        <p className="mt-1 text-center text-sm text-sand-500">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-sand-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-sand-700">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-combat-600 px-4 py-2 text-sm font-semibold text-white hover:bg-combat-700 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
