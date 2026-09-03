import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCourseSession } from "@/lib/course/auth/server";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getCourseSession();
  if (!session?.category) redirect("/course/login");

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

  if (!course || course.category !== session.category || !course.isPublished) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/course/courses" className="text-sm text-study-700 hover:underline">
          &larr; All courses
        </Link>
        <h1 className="text-xl font-semibold text-study-800 mt-1">{course.title}</h1>
        {course.description && <p className="text-sm text-parchment-600 mt-1">{course.description}</p>}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium text-study-800">Materials</h2>
        {course.documents.length === 0 ? (
          <p className="text-sm text-parchment-500">No materials posted yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
            {course.documents.map((doc) => (
              <a
                key={doc.id}
                href={`/course/api/files/${doc.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 hover:bg-parchment-50"
              >
                <span className="font-medium text-study-700">{doc.title}</span>
                <span className="text-xs text-parchment-500">Download</span>
              </a>
            ))}
          </div>
        )}
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
