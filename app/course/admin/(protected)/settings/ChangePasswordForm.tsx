"use client";

import { useState, useTransition } from "react";
import { changeCourseAdminPassword } from "@/app/actions/course-auth";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    startTransition(async () => {
      const result = await changeCourseAdminPassword({ currentPassword, newPassword });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3 max-w-sm">
      <h2 className="font-medium text-study-800">Change Password</h2>
      <div>
        <label className="block text-sm font-medium text-parchment-700 mb-1">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-parchment-700 mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          required
          minLength={6}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-parchment-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-combat-700">Password updated.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-study-600 text-white text-sm px-4 py-2 hover:bg-study-700 disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
