"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";

export async function listCourseQuizResults() {
  await requireCourseAdmin();
  return prisma.courseQuizAttempt.findMany({
    where: { status: { in: ["SUBMITTED", "EXPIRED"] } },
    orderBy: { submittedAt: "desc" },
    include: { quiz: { include: { course: true } } },
  });
}

export async function deleteCourseQuizResult(attemptId: string): Promise<void> {
  await requireCourseAdmin();
  await prisma.courseQuizAttempt.delete({ where: { id: attemptId } }).catch(() => {});
  revalidatePath("/course/admin/results");
}
