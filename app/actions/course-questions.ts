"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";
import { courseQuestionSchema } from "@/lib/course/validation";
import type { CourseActionResult } from "@/app/actions/course-auth";

export async function createCourseQuestion(input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const quiz = await prisma.courseQuiz.findUnique({ where: { id: parsed.data.quizId } });
  if (!quiz) return { success: false, error: "Quiz not found" };

  await prisma.courseQuestion.create({ data: parsed.data });
  revalidatePath(`/course/admin/courses/${quiz.courseId}/quizzes/${quiz.id}`);
  return { success: true };
}

export async function updateCourseQuestion(questionId: string, input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const question = await prisma.courseQuestion.update({ where: { id: questionId }, data: parsed.data });
  const quiz = await prisma.courseQuiz.findUnique({ where: { id: question.quizId } });
  if (quiz) revalidatePath(`/course/admin/courses/${quiz.courseId}/quizzes/${quiz.id}`);
  return { success: true };
}

export async function deleteCourseQuestion(questionId: string): Promise<void> {
  await requireCourseAdmin();
  const question = await prisma.courseQuestion.delete({ where: { id: questionId } });
  const quiz = await prisma.courseQuiz.findUnique({ where: { id: question.quizId } });
  if (quiz) revalidatePath(`/course/admin/courses/${quiz.courseId}/quizzes/${quiz.id}`);
}
