"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";
import { courseQuizSchema } from "@/lib/course/validation";
import { sendCoursePushToCategory } from "@/lib/course/push";
import type { CourseActionResult } from "@/app/actions/course-auth";

export async function createCourseQuiz(input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course) return { success: false, error: "Course not found" };

  const quiz = await prisma.courseQuiz.create({ data: parsed.data });
  revalidatePath(`/course/admin/courses/${course.id}`);

  sendCoursePushToCategory(course.category, {
    title: "New quiz available",
    body: `${course.title}: ${quiz.title}`,
    url: `/course/courses/${course.category}/${course.id}`,
  }).catch(() => {});

  return { success: true };
}

export async function updateCourseQuiz(quizId: string, input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const quiz = await prisma.courseQuiz.update({ where: { id: quizId }, data: parsed.data });
  revalidatePath(`/course/admin/courses/${quiz.courseId}`);
  revalidatePath(`/course/admin/courses/${quiz.courseId}/quizzes/${quizId}`);
  return { success: true };
}

export async function deleteCourseQuiz(quizId: string): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const quiz = await prisma.courseQuiz.delete({ where: { id: quizId } });
  revalidatePath(`/course/admin/courses/${quiz.courseId}`);
  return { success: true };
}
