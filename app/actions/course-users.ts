"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";

export async function listPendingCourseUsers() {
  await requireCourseAdmin();
  return prisma.courseUser.findMany({
    where: { role: "PARTICIPANT", status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}

export async function approveCourseUser(userId: string): Promise<void> {
  await requireCourseAdmin();
  await prisma.courseUser.update({ where: { id: userId }, data: { status: "APPROVED" } });
  revalidatePath("/course/admin/users");
}

export async function rejectCourseUser(userId: string): Promise<void> {
  await requireCourseAdmin();
  await prisma.courseUser.update({ where: { id: userId }, data: { status: "REJECTED" } });
  revalidatePath("/course/admin/users");
}
