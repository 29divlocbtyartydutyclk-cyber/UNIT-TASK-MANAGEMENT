import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseQuizAttemptClient from "./CourseQuizAttemptClient";

export default async function CourseQuizAttemptPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = await prisma.courseQuiz.findUnique({
    where: { id: quizId },
    include: { _count: { select: { questions: true } } },
  });
  if (!quiz || !quiz.isPublished || quiz._count.questions === 0) notFound();

  return <CourseQuizAttemptClient quizId={quiz.id} quizTitle={quiz.title} />;
}
