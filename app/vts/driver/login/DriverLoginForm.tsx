"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { vtsDriverLogin } from "@/app/actions/vts-auth";

export default function DriverLoginForm({
  drivers,
}: {
  drivers: { id: string; name: string; serviceId: string }[];
}) {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await vtsDriverLogin({ driverId, password });
      if (result && !result.success) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-parchment-700 mb-1">Your Name</label>
        <select
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Select your name
          </option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.serviceId})
            </option>
          ))}
        </select>
        {drivers.length === 0 && (
          <p className="text-xs text-parchment-500 mt-1">No drivers registered yet - contact admin.</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-parchment-700 mb-1">Driver Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-amber-700 text-white py-2 text-sm font-medium hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm">
        <Link href="/vts" className="text-parchment-500">
          &larr; Back
        </Link>
      </p>
    </form>
  );
}
