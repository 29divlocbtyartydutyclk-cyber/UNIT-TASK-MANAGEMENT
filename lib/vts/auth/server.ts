import "server-only";
import { cookies } from "next/headers";
import {
  VTS_SESSION_COOKIE_NAME,
  VTS_SESSION_DURATION_SECONDS,
  createVtsSessionToken,
  verifyVtsSessionToken,
  type VtsSessionPayload,
} from "@/lib/vts/auth/session";

export async function getVtsSession(): Promise<VtsSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(VTS_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyVtsSessionToken(token);
}

export async function setVtsSessionCookie(payload: VtsSessionPayload) {
  const token = await createVtsSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(VTS_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VTS_SESSION_DURATION_SECONDS,
  });
}

export async function clearVtsSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(VTS_SESSION_COOKIE_NAME);
}

export async function requireVtsAdmin(): Promise<Extract<VtsSessionPayload, { role: "ADMIN" }>> {
  const session = await getVtsSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session;
}

export async function requireVtsDriver(): Promise<Extract<VtsSessionPayload, { role: "DRIVER" }>> {
  const session = await getVtsSession();
  if (!session || session.role !== "DRIVER") {
    throw new Error("Driver access required");
  }
  return session;
}
