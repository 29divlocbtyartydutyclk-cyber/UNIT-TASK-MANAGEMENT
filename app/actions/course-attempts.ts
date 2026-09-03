"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCourseParticipant } from "@/lib/course/auth/server";
import { courseSubmitAttemptSchema } from "@/lib/course/validation";
import {
  pickRandomQuestions,
  sanitizeQuestions,
  type CourseQuestionSource,
  type SanitizedCourseQuestion,
} from "@/lib/course/quiz/randomize";
import { gradeCourseAttempt } from "@/lib/course/quiz/grading";

const RESUME_GRACE_SECONDS = 10;

export type StartCourseAttemptResult =
  | {
      success: true;
      attemptId: string;
      timeLimitSeconds: number;
      secondsElapsed: number;
      questions: SanitizedCourseQuestion[];
    }
  | { success: false; error: string };

export async function startCourseAttempt(quizId: string): Promise<StartCourseAttemptResult> {
  const session = await requireCourseParticipant();

  const quiz = await prisma.courseQuiz.findUnique({
    where: { id: quizId },
    include: { course: true, questions: true },
  });
  if (!quiz || !quiz.isPublished) return { success: false, error: "Quiz not found" };
  if (quiz.course.category !== session.category) return { success: false, error: "Not available for your category" };

  const existing = await prisma.courseQuizAttempt.findFirst({
    where: { quizId, userId: session.sub, status: "IN_PROGRESS" },
    orderBy: { startedAt: "desc" },
  });

  if (existing) {
    const elapsedSeconds = Math.floor((Date.now() - existing.startedAt.getTime()) / 1000);
    if (elapsedSeconds < existing.timeLimitSecondsSnapshot + RESUME_GRACE_SECONDS) {
      const snapshot: CourseQuestionSource[] = JSON.parse(existing.questionsSnapshot);
      return {
        success: true,
        attemptId: existing.id,
        timeLimitSeconds: existing.timeLimitSecondsSnapshot,
        secondsElapsed: elapsedSeconds,
        questions: sanitizeQuestions(snapshot),
      };
    }
  }

  if (quiz.questions.length === 0) return { success: false, error: "This quiz has no questions yet" };

  const snapshotSource: CourseQuestionSource[] = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOptionIndex: q.correctOptionIndex,
    explanation: q.explanation,
  }));
  const served = pickRandomQuestions(snapshotSource, quiz.questionsPerAttempt);

  const attempt = await prisma.courseQuizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: session.sub,
      status: "IN_PROGRESS",
      timeLimitSecondsSnapshot: quiz.timeLimitSeconds,
      questionsSnapshot: JSON.stringify(served),
      totalQuestions: served.length,
    },
  });

  return {
    success: true,
    attemptId: attempt.id,
    timeLimitSeconds: quiz.timeLimitSeconds,
    secondsElapsed: 0,
    questions: sanitizeQuestions(served),
  };
}

export async function submitCourseAttempt(input: unknown) {
  const session = await requireCourseParticipant();
  const parsed = courseSubmitAttemptSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const attempt = await prisma.courseQuizAttempt.findUnique({ where: { id: parsed.data.attemptId } });
  if (!attempt || attempt.userId !== session.sub) {
    return { success: false as const, error: "Attempt not found" };
  }

  if (attempt.status !== "IN_PROGRESS") {
    redirect(`/course/quizzes/${attempt.quizId}/result/${attempt.id}`);
  }

  const snapshot: CourseQuestionSource[] = JSON.parse(attempt.questionsSnapshot);
  const graded = gradeCourseAttempt(snapshot, parsed.data.answers);

  const elapsedSeconds = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);
  const expired = elapsedSeconds > attempt.timeLimitSecondsSnapshot + RESUME_GRACE_SECONDS;

  await prisma.courseQuizAttempt.update({
    where: { id: attempt.id },
    data: {
      status: expired ? "EXPIRED" : "SUBMITTED",
      answers: JSON.stringify(graded.answers),
      score: graded.score,
      submittedAt: new Date(),
    },
  });

  redirect(`/course/quizzes/${attempt.quizId}/result/${attempt.id}`);
}
