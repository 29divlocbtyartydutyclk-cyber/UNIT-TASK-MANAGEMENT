import "server-only";
import { cookies } from "next/headers";
import {
  COURSE_SESSION_COOKIE_NAME,
  COURSE_SESSION_DURATION_SECONDS,
  createCourseSessionToken,
  verifyCourseSessionToken,
  type CourseSessionPayload,
} from "@/lib/course/auth/session";

export async function getCourseSession(): Promise<CourseSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COURSE_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCourseSessionToken(token);
}

export async function setCourseSessionCookie(payload: CourseSessionPayload) {
  const token = await createCourseSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COURSE_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COURSE_SESSION_DURATION_SECONDS,
  });
}

export async function clearCourseSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COURSE_SESSION_COOKIE_NAME);
}

export async function requireCourseAdmin(): Promise<CourseSessionPayload> {
  const session = await getCourseSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session;
}

export async function requireCourseParticipant(): Promise<CourseSessionPayload> {
  const session = await getCourseSession();
  if (!session || session.role !== "PARTICIPANT" || session.status !== "APPROVED") {
    throw new Error("Approved participant access required");
  }
  return session;
}
