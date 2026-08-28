"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Role } from "@/lib/auth/session";

const RoleContext = createContext<Role | null>(null);

export function RoleProvider({ role, children }: { role: Role | null; children: ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole(): Role | null {
  return useContext(RoleContext);
}

export function useCanEdit(): boolean {
  const role = useRole();
  return role === "Admin" || role === "Clerk";
}

export function useIsAdmin(): boolean {
  return useRole() === "Admin";
}
