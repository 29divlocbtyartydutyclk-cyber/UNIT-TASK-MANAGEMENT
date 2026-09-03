import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COURSE_CATEGORIES, type CourseCategoryValue } from "@/lib/course/constants";
import MaterialsList from "./MaterialsList";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ category: string; courseId: string }>;
}) {
  const { category, courseId } = await params;
  if (!COURSE_CATEGORIES.includes(category as CourseCategoryValue)) notFound();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      documents: { orderBy: { uploadedAt: "desc" } },
      quizzes: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { questions: true } } },
      },
    },
  });

  if (!course || course.category !== category || !course.isPublished) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/course/courses/${category}`} className="text-sm text-study-700 hover:underline">
          &larr; All courses
        </Link>
        <h1 className="text-xl font-semibold text-study-800 mt-1">{course.title}</h1>
        {course.description && <p className="text-sm text-parchment-600 mt-1">{course.description}</p>}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-study-800">Materials</h2>
        <MaterialsList documents={course.documents} />
      </section>

      <section className="space-y-2">
        <h2 className="font-medium text-study-800">Quizzes</h2>
        {course.quizzes.length === 0 ? (
          <p className="text-sm text-parchment-500">No quizzes posted yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
            {course.quizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-study-700">{quiz.title}</p>
                  <p className="text-xs text-parchment-500">
                    {quiz._count.questions === 0
                      ? "No questions yet"
                      : `${quiz.questionsPerAttempt} questions · ${Math.round(quiz.timeLimitSeconds / 60)} min`}
                  </p>
                </div>
                {quiz._count.questions > 0 && (
                  <Link
                    href={`/course/quizzes/${quiz.id}/attempt`}
                    className="rounded bg-study-600 text-white text-sm px-3 py-1.5 hover:bg-study-700 shrink-0"
                  >
                    Start
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
