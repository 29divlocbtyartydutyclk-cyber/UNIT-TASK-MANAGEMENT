"use client";

import { useState, type FormEvent } from "react";
import { changeRolePassword } from "@/app/actions/auth";
import { ROLES, type Role } from "@/lib/auth/session";

const inputClass =
  "mt-1 w-full max-w-sm rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500";

function RolePasswordRow({ role }: { role: Role }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const result = await changeRolePassword(role, password);
    if (!result.success) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm font-medium text-sand-700">{role} Password</label>
        <input
          type="password"
          required
          minLength={4}
          placeholder="New password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md border border-sand-300 px-3 py-2 text-sm font-medium text-sand-700 hover:bg-sand-50 disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : "Update"}
      </button>
      {status === "saved" && <span className="text-sm text-combat-600">Saved</span>}
      {status === "error" && error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}

export function RolePasswordsForm() {
  return (
    <div className="space-y-4">
      {ROLES.map((role) => (
        <RolePasswordRow key={role} role={role} />
      ))}
    </div>
  );
}
