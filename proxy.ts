import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { COURSE_SESSION_COOKIE_NAME, verifyCourseSessionToken } from "@/lib/course/auth/session";
import { VTS_SESSION_COOKIE_NAME, verifyVtsSessionToken } from "@/lib/vts/auth/session";

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
  "/course/admin/login",
  "/vts/driver/login",
  "/vts/admin/login",
];

// Exact-match-only public paths (must NOT also match as a prefix, since
// child routes like /vts/admin need to stay gated).
const PUBLIC_EXACT_PATHS = ["/", "/vts", "/course"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_EXACT_PATHS.includes(pathname) ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/vts")) {
    const token = request.cookies.get(VTS_SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifyVtsSessionToken(token) : null;

    if (!session) {
      const fallback = pathname.startsWith("/vts/admin") ? "/vts/admin/login" : "/vts/driver/login";
      return NextResponse.redirect(new URL(fallback, request.url));
    }
    if (pathname.startsWith("/vts/admin") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/vts/driver/login", request.url));
    }
    if (pathname.startsWith("/vts/driver") && session.role !== "DRIVER") {
      return NextResponse.redirect(new URL("/vts/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/course/admin")) {
    const token = request.cookies.get(COURSE_SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifyCourseSessionToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/course/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // All other /course/** paths (participant browsing, quizzes, file downloads)
  // are public - there is no participant login.
  if (pathname.startsWith("/course")) {
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
