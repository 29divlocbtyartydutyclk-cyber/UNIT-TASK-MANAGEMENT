import { SignJWT, jwtVerify } from "jose";

export type CourseRole = "ADMIN" | "PARTICIPANT";
export type CourseCategory = "OFFICER" | "JCO" | "OR";
export type CourseApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CourseSessionPayload = {
  sub: string;
  role: CourseRole;
  category: CourseCategory | null;
  status: CourseApprovalStatus;
};

export const COURSE_SESSION_COOKIE_NAME = "course_session";
export const COURSE_SESSION_DURATION_SECONDS = 6 * 60 * 60;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createCourseSessionToken(payload: CourseSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COURSE_SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCourseSessionToken(token: string): Promise<CourseSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      (payload.role === "ADMIN" || payload.role === "PARTICIPANT") &&
      (payload.category === null ||
        payload.category === "OFFICER" ||
        payload.category === "JCO" ||
        payload.category === "OR") &&
      (payload.status === "PENDING" || payload.status === "APPROVED" || payload.status === "REJECTED")
    ) {
      return {
        sub: payload.sub,
        role: payload.role,
        category: payload.category,
        status: payload.status,
      };
    }
    return null;
  } catch {
    return null;
  }
}
