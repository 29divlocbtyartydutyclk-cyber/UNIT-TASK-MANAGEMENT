import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteCourseQuestion } from "@/app/actions/course-questions";
import AddQuestionForm from "./AddQuestionForm";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default async function CourseAdminQuizDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  const quiz = await prisma.courseQuiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  });
  if (!quiz || quiz.courseId !== courseId) notFound();

  const bankSize = quiz.questions.length;
  const shortfall = bankSize < quiz.questionsPerAttempt;

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/course/admin/courses/${courseId}`} className="text-sm text-study-700 hover:underline">
          &larr; Back to course
        </Link>
        <h1 className="text-2xl font-semibold text-study-800 mt-1">{quiz.title}</h1>
        <p className={`text-sm ${shortfall ? "text-red-600" : "text-parchment-600"}`}>
          {bankSize} question{bankSize === 1 ? "" : "s"} in bank / requires {quiz.questionsPerAttempt} per attempt
          {shortfall ? " — add more questions before publishing" : ""}
        </p>
      </div>

      <AddQuestionForm quizId={quiz.id} />

      <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-study-800">
                {idx + 1}. {q.text}
              </p>
              <form action={deleteCourseQuestion.bind(null, q.id)}>
                <button type="submit" className="text-sm text-red-600 hover:underline shrink-0">
                  Delete
                </button>
              </form>
            </div>
            <ul className="text-sm space-y-1">
              {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, i) => (
                <li
                  key={i}
                  className={i === q.correctOptionIndex ? "text-study-700 font-medium" : "text-parchment-700"}
                >
                  {OPTION_LABELS[i]}. {opt}
                  {i === q.correctOptionIndex ? " ✓" : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
