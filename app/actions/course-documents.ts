"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseAdmin } from "@/lib/course/auth/server";
import { courseDocumentMetaSchema } from "@/lib/course/validation";
import { buildCourseStoredPath, saveCourseFile, deleteCourseFile } from "@/lib/course/files/storage";
import { COURSE_ALLOWED_MIME_TYPES, COURSE_MAX_UPLOAD_BYTES } from "@/lib/course/constants";
import { sendCoursePushToCategory } from "@/lib/course/push";
import type { CourseActionResult } from "@/app/actions/course-auth";

export async function uploadCourseDocument(formData: FormData): Promise<CourseActionResult> {
  const session = await requireCourseAdmin();

  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "");
  const file = formData.get("file");

  const parsedMeta = courseDocumentMetaSchema.safeParse({ courseId, title });
  if (!parsedMeta.success) {
    return { success: false, error: parsedMeta.error.issues[0]?.message ?? "Invalid input" };
  }

  if (!(file instanceof File)) {
    return { success: false, error: "A file is required" };
  }
  if (!COURSE_ALLOWED_MIME_TYPES[file.type]) {
    return { success: false, error: "Unsupported file type" };
  }
  if (file.size > COURSE_MAX_UPLOAD_BYTES) {
    return { success: false, error: "File is too large" };
  }

  const course = await prisma.course.findUnique({ where: { id: parsedMeta.data.courseId } });
  if (!course) {
    return { success: false, error: "Course not found" };
  }

  const storedFilePath = await buildCourseStoredPath(course.id, file.type);
  const buffer = Buffer.from(await file.arrayBuffer());
  await saveCourseFile(storedFilePath, buffer);

  await prisma.courseDocument.create({
    data: {
      courseId: course.id,
      title: parsedMeta.data.title,
      storedFilePath,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedById: session.sub,
    },
  });

  revalidatePath(`/course/admin/courses/${course.id}`);
  revalidatePath(`/course/courses/${course.id}`);

  sendCoursePushToCategory(course.category, {
    title: "New course material",
    body: `${course.title}: ${parsedMeta.data.title}`,
    url: `/course/courses/${course.id}`,
  }).catch(() => {});

  return { success: true };
}

export async function deleteCourseDocument(documentId: string): Promise<void> {
  await requireCourseAdmin();
  const document = await prisma.courseDocument.findUnique({ where: { id: documentId } });
  if (!document) return;

  await prisma.courseDocument.delete({ where: { id: documentId } });
  await deleteCourseFile(document.storedFilePath);

  revalidatePath(`/course/admin/courses/${document.courseId}`);
  revalidatePath(`/course/courses/${document.courseId}`);
}
