import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCourseSession } from "@/lib/course/auth/server";
import type { CourseQuestionSource } from "@/lib/course/quiz/randomize";
import type { GradedCourseAnswer } from "@/lib/course/quiz/grading";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default async function CourseQuizResultPage({
  params,
}: {
  params: Promise<{ quizId: string; attemptId: string }>;
}) {
  const { quizId, attemptId } = await params;
  const session = await getCourseSession();
  if (!session) redirect("/course/login");

  const attempt = await prisma.courseQuizAttempt.findUnique({
    where: { id: attemptId },
    include: { quiz: { include: { course: true } } },
  });

  if (!attempt || attempt.quizId !== quizId) notFound();
  if (attempt.userId !== session.sub && session.role !== "ADMIN") notFound();

  if (attempt.status === "IN_PROGRESS" || !attempt.answers) {
    redirect(`/course/quizzes/${quizId}/attempt`);
  }

  const snapshot: CourseQuestionSource[] = JSON.parse(attempt.questionsSnapshot);
  const answers: GradedCourseAnswer[] = JSON.parse(attempt.answers);
  const snapshotById = new Map(snapshot.map((q) => [q.id, q]));

  return (
    <div className="min-h-screen bg-parchment-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-sm text-parchment-600">{attempt.quiz.title}</p>
          <p className="text-4xl font-semibold text-study-800 mt-1">
            {attempt.score} / {attempt.totalQuestions}
          </p>
          {attempt.status === "EXPIRED" && (
            <p className="text-sm text-amber-600 mt-2">Time expired - your answers were auto-submitted.</p>
          )}
          <Link
            href={`/course/courses/${attempt.quiz.course.id}`}
            className="inline-block mt-4 text-sm text-study-700 hover:underline"
          >
            &larr; Back to course
          </Link>
        </div>

        <div className="space-y-3">
          {answers.map((a, idx) => {
            const question = snapshotById.get(a.questionId);
            if (!question) return null;
            const options = [question.optionA, question.optionB, question.optionC, question.optionD];
            return (
              <div key={a.questionId} className="bg-white rounded-lg shadow p-4 space-y-2">
                <p className="font-medium text-study-800">
                  {idx + 1}. {question.text}
                </p>
                <ul className="text-sm space-y-1">
                  {options.map((opt, i) => {
                    const isCorrect = i === a.correctOptionIndex;
                    const isChosen = i === a.chosenOptionIndex;
                    return (
                      <li
                        key={i}
                        className={
                          isCorrect
                            ? "text-study-700 font-medium"
                            : isChosen
                              ? "text-red-600"
                              : "text-parchment-700"
                        }
                      >
                        {OPTION_LABELS[i]}. {opt}
                        {isCorrect ? " ✓" : isChosen ? " ✗ (your answer)" : ""}
                      </li>
                    );
                  })}
                </ul>
                {question.explanation && <p className="text-xs text-parchment-500">{question.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
