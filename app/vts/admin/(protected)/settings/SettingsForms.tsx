"use client";

import { useState, useTransition } from "react";
import { changeVtsAdminPassword, changeVtsDriverPassword } from "@/app/actions/vts-auth";

export default function SettingsForms() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <ChangeAdminPasswordForm />
      <ChangeDriverPasswordForm />
    </div>
  );
}

function ChangeAdminPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await changeVtsAdminPassword({ currentPassword, newPassword });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-amber-900">Change Admin Password</h2>
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        required
      />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        required
        minLength={6}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">Updated.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update"}
      </button>
    </form>
  );
}

function ChangeDriverPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await changeVtsDriverPassword({ newPassword });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setNewPassword("");
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-amber-900">Change Driver Password</h2>
      <p className="text-xs text-parchment-500">Shared by all drivers when signing in.</p>
      <input
        type="password"
        placeholder="New driver password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        required
        minLength={4}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">Updated.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
