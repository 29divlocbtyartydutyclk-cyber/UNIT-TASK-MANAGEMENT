import { SignJWT, jwtVerify } from "jose";

export const ROLES = ["Admin", "Clerk", "Viewer"] as const;
export type Role = (typeof ROLES)[number];

export const SESSION_COOKIE_NAME = "session";
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(role: Role): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<Role | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const role = payload.role;
    if (typeof role === "string" && (ROLES as readonly string[]).includes(role)) {
      return role as Role;
    }
    return null;
  } catch {
    return null;
  }
}

export function canEdit(role: Role | null): boolean {
  return role === "Admin" || role === "Clerk";
}

export function isAdmin(role: Role | null): boolean {
  return role === "Admin";
}
