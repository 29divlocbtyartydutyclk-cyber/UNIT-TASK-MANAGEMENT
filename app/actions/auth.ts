"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, clearSessionCookie, getSessionRole } from "@/lib/auth/server";
import { ROLES, type Role } from "@/lib/auth/session";

export type LoginResult = { success: true } | { success: false; error: string };

const ROLE_HASH_FIELD = {
  Admin: "adminPasswordHash",
  Clerk: "clerkPasswordHash",
  Viewer: "viewerPasswordHash",
} as const satisfies Record<Role, string>;

export async function login(role: string, password: string): Promise<LoginResult> {
  if (!(ROLES as readonly string[]).includes(role)) {
    return { success: false, error: "Invalid role" };
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return { success: false, error: "App is not set up yet" };
  }

  const hash = settings[ROLE_HASH_FIELD[role as Role]];
  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  await setSessionCookie(role as Role);
  redirect("/dashboard");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

export async function changeRolePassword(role: string, newPassword: string): Promise<LoginResult> {
  const callerRole = await getSessionRole();
  if (callerRole !== "Admin") {
    return { success: false, error: "Only Admin can change passwords" };
  }
  if (!(ROLES as readonly string[]).includes(role)) {
    return { success: false, error: "Invalid role" };
  }
  if (newPassword.length < 4) {
    return { success: false, error: "Password must be at least 4 characters" };
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.settings.update({
    where: { id: 1 },
    data: { [ROLE_HASH_FIELD[role as Role]]: hash },
  });
  return { success: true };
}
