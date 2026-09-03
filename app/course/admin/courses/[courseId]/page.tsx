import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COURSE_CATEGORY_LABELS } from "@/lib/course/constants";
import { deleteCourseDocument } from "@/app/actions/course-documents";
import UploadDocumentForm from "./UploadDocumentForm";
import CreateQuizForm from "./CreateQuizForm";

export default async function CourseAdminCourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      documents: { orderBy: { uploadedAt: "desc" } },
      quizzes: { orderBy: { createdAt: "desc" }, include: { _count: { select: { questions: true } } } },
    },
  });
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/course/admin/courses" className="text-sm text-study-700 hover:underline">
          &larr; All courses
        </Link>
        <h1 className="text-2xl font-semibold text-study-800 mt-1">{course.title}</h1>
        <p className="text-sm text-parchment-600">{COURSE_CATEGORY_LABELS[course.category]}</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-study-800">Materials</h2>
        <UploadDocumentForm courseId={course.id} />
        {course.documents.length === 0 ? (
          <p className="text-sm text-parchment-500">No materials uploaded yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
            {course.documents.map((doc) => (
              <div key={doc.id} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-study-800 truncate">{doc.title}</p>
                  <p className="text-xs text-parchment-500">{doc.originalName}</p>
                </div>
                <form action={deleteCourseDocument.bind(null, doc.id)}>
                  <button type="submit" className="text-sm text-red-600 hover:underline shrink-0">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-study-800">Quizzes</h2>
        <CreateQuizForm courseId={course.id} />
        {course.quizzes.length === 0 ? (
          <p className="text-sm text-parchment-500">No quizzes yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
            {course.quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/course/admin/courses/${course.id}/quizzes/${quiz.id}`}
                className="p-3 flex items-center justify-between hover:bg-parchment-50"
              >
                <div>
                  <p className="font-medium text-study-800">{quiz.title}</p>
                  <p className="text-xs text-parchment-500">
                    {quiz._count.questions} question{quiz._count.questions === 1 ? "" : "s"} in bank ·{" "}
                    {quiz.questionsPerAttempt} served per attempt · {Math.round(quiz.timeLimitSeconds / 60)} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
