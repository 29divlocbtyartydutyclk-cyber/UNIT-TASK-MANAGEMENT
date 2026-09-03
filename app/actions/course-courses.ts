"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";
import { courseSchema } from "@/lib/course/validation";
import { deleteCourseFile } from "@/lib/course/files/storage";
import type { CourseActionResult } from "@/app/actions/course-auth";

export async function createCourse(input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.course.create({ data: parsed.data });
  revalidatePath("/course/admin/courses");
  return { success: true };
}

export async function updateCourse(courseId: string, input: unknown): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.course.update({ where: { id: courseId }, data: parsed.data });
  revalidatePath("/course/admin/courses");
  revalidatePath(`/course/admin/courses/${courseId}`);
  return { success: true };
}

export async function setCoursePublished(courseId: string, isPublished: boolean): Promise<CourseActionResult> {
  await requireCourseAdmin();
  await prisma.course.update({ where: { id: courseId }, data: { isPublished } });
  revalidatePath("/course/admin/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string): Promise<CourseActionResult> {
  await requireCourseAdmin();
  const documents = await prisma.courseDocument.findMany({ where: { courseId }, select: { storedFilePath: true } });
  await prisma.course.delete({ where: { id: courseId } });
  await Promise.all(documents.map((d) => deleteCourseFile(d.storedFilePath)));
  revalidatePath("/course/admin/courses");
  return { success: true };
}
