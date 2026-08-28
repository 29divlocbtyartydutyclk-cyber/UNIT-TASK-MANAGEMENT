import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  createSessionToken,
  verifySessionToken,
  type Role,
} from "@/lib/auth/session";

export async function getSessionRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(role: Role) {
  const token = await createSessionToken(role);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
