import { SignJWT, jwtVerify } from "jose";

export type VtsRole = "ADMIN" | "DRIVER";

export type VtsSessionPayload =
  | { role: "ADMIN" }
  | { role: "DRIVER"; driverId: string; driverName: string; serviceId: string };

export const VTS_SESSION_COOKIE_NAME = "vts_session";
export const VTS_SESSION_DURATION_SECONDS = 12 * 60 * 60;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createVtsSessionToken(payload: VtsSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${VTS_SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyVtsSessionToken(token: string): Promise<VtsSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role === "ADMIN") {
      return { role: "ADMIN" };
    }
    if (
      payload.role === "DRIVER" &&
      typeof payload.driverId === "string" &&
      typeof payload.driverName === "string" &&
      typeof payload.serviceId === "string"
    ) {
      return {
        role: "DRIVER",
        driverId: payload.driverId,
        driverName: payload.driverName,
        serviceId: payload.serviceId,
      };
    }
    return null;
  } catch {
    return null;
  }
}
