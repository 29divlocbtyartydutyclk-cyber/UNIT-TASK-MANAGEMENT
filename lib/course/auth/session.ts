import { SignJWT, jwtVerify } from "jose";

// The only account in Course is the fixed admin - there is no participant
// login, so a valid session always means "signed in as admin".
export type CourseSessionPayload = { role: "ADMIN" };

export const COURSE_SESSION_COOKIE_NAME = "course_session";
export const COURSE_SESSION_DURATION_SECONDS = 6 * 60 * 60;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createCourseSessionToken(): Promise<string> {
  return new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COURSE_SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCourseSessionToken(token: string): Promise<CourseSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role === "ADMIN") {
      return { role: "ADMIN" };
    }
    return null;
  } catch {
    return null;
  }
}
