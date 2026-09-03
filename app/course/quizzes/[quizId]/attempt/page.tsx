import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startCourseAttempt } from "@/app/actions/course-attempts";
import CourseQuizAttemptClient from "./CourseQuizAttemptClient";

export default async function CourseQuizAttemptPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = await prisma.courseQuiz.findUnique({ where: { id: quizId } });
  if (!quiz) notFound();

  const result = await startCourseAttempt(quizId);

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 px-4">
        <div className="max-w-sm text-center space-y-3">
          <p className="text-red-600">{result.error}</p>
          <Link href="/course/courses" className="text-study-700 hover:underline text-sm">
            &larr; Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CourseQuizAttemptClient
      quizTitle={quiz.title}
      attemptId={result.attemptId}
      timeLimitSeconds={result.timeLimitSeconds}
      secondsElapsed={result.secondsElapsed}
      questions={result.questions}
    />
  );
}
