"use client";

import { logout } from "@/app/actions/auth";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => logout()} className={className}>
      Logout
    </button>
  );
}
