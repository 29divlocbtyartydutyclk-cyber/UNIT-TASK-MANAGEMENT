"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setCourseSessionCookie, clearCourseSessionCookie, requireCourseAdmin } from "@/lib/course/auth/server";
import { courseLoginSchema, courseChangePasswordSchema } from "@/lib/course/validation";

export type CourseActionResult = { success: true } | { success: false; error: string };

export async function courseLogin(input: unknown): Promise<CourseActionResult> {
  const parsed = courseLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const settings = await prisma.courseSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return { success: false, error: "System is not set up yet" };
  }

  const valid = await bcrypt.compare(parsed.data.password, settings.adminPasswordHash);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  await setCourseSessionCookie();
  redirect("/course/admin");
}

export async function courseLogout() {
  await clearCourseSessionCookie();
  redirect("/course");
}

export async function changeCourseAdminPassword(input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseChangePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const settings = await prisma.courseSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return { success: false, error: "System is not set up yet" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, settings.adminPasswordHash);
  if (!valid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const adminPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.courseSettings.update({ where: { id: 1 }, data: { adminPasswordHash } });

  return { success: true };
}
