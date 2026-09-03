import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { COURSE_SESSION_COOKIE_NAME, verifyCourseSessionToken } from "@/lib/course/auth/session";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/cron",
  "/access",
  "/manifest.json",
  "/sw.js",
  "/icon-192.png",
  "/icon-512.png",
  "/qr-access.png",
  "/favicon.ico",
  "/unit-tasks.apk",
  "/course/login",
  "/course/register",
  "/course/pending-approval",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || PUBLIC_PATHS.some((p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/course")) {
    const token = request.cookies.get(COURSE_SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifyCourseSessionToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/course/login", request.url));
    }
    if (session.role !== "ADMIN" && session.status !== "APPROVED" && pathname !== "/course/pending-approval") {
      return NextResponse.redirect(new URL("/course/pending-approval", request.url));
    }
    if (pathname.startsWith("/course/admin") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/course/courses", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const role = token ? await verifySessionToken(token) : null;

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
