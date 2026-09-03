"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setCourseSessionCookie, clearCourseSessionCookie, requireCourseAdmin } from "@/lib/course/auth/server";
import { courseRegisterSchema, courseLoginSchema, courseChangePasswordSchema } from "@/lib/course/validation";

export type CourseActionResult = { success: true } | { success: false; error: string };

export async function courseRegister(input: unknown): Promise<CourseActionResult> {
  const parsed = courseRegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { serviceNumber, name, rank, category, password } = parsed.data;

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.courseUser.create({
      data: {
        serviceNumber,
        name,
        rank,
        category,
        passwordHash,
        role: "PARTICIPANT",
        status: "PENDING",
      },
    });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return { success: false, error: "This service number is already registered" };
    }
    throw err;
  }

  redirect("/course/pending-approval");
}

export async function courseLogin(input: unknown): Promise<CourseActionResult> {
  const parsed = courseLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { serviceNumber, password } = parsed.data;

  const user = await prisma.courseUser.findUnique({ where: { serviceNumber } });
  if (!user) {
    return { success: false, error: "Incorrect service number or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Incorrect service number or password" };
  }

  if (user.role === "PARTICIPANT" && user.status === "PENDING") {
    return { success: false, error: "Your account is still awaiting admin approval" };
  }
  if (user.role === "PARTICIPANT" && user.status === "REJECTED") {
    return { success: false, error: "Your registration was not approved. Contact your admin." };
  }

  await setCourseSessionCookie({
    sub: user.id,
    role: user.role,
    category: user.category,
    status: user.status,
  });

  redirect(user.role === "ADMIN" ? "/course/admin" : "/course/courses");
}

export async function courseLogout() {
  await clearCourseSessionCookie();
  redirect("/course/login");
}

export async function changeCourseAdminPassword(input: unknown): Promise<CourseActionResult> {
  const session = await requireCourseAdmin();
  const parsed = courseChangePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.courseUser.findUnique({ where: { id: session.sub } });
  if (!user) {
    return { success: false, error: "Account not found" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.courseUser.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: true };
}
