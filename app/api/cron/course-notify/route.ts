import { NextRequest, NextResponse } from "next/server";
import { subHours } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendCoursePushToCategory } from "@/lib/course/push";
import { COURSE_CATEGORIES } from "@/lib/course/constants";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = subHours(new Date(), 24);
  const results: Record<string, { documents: number; quizzes: number }> = {};

  for (const category of COURSE_CATEGORIES) {
    const [documents, quizzes] = await Promise.all([
      prisma.courseDocument.count({ where: { uploadedAt: { gte: since }, course: { category } } }),
      prisma.courseQuiz.count({ where: { createdAt: { gte: since }, course: { category } } }),
    ]);

    results[category] = { documents, quizzes };

    if (documents > 0 || quizzes > 0) {
      const parts: string[] = [];
      if (documents > 0) parts.push(`${documents} new document${documents === 1 ? "" : "s"}`);
      if (quizzes > 0) parts.push(`${quizzes} new quiz${quizzes === 1 ? "" : "zes"}`);

      await sendCoursePushToCategory(category, {
        title: "New course material available",
        body: parts.join(" and "),
        url: "/course/courses",
      });
    }
  }

  return NextResponse.json({ sent: true, results });
}
