import type { CourseQuestionSource } from "@/lib/course/quiz/randomize";

export type SubmittedCourseAnswer = { questionId: string; chosenOptionIndex: number | null };

export type GradedCourseAnswer = SubmittedCourseAnswer & { isCorrect: boolean; correctOptionIndex: number };

export type CourseGradeResult = {
  answers: GradedCourseAnswer[];
  score: number;
  total: number;
};

/** Grades submitted answers against the frozen question snapshot - never against live Question rows. */
export function gradeCourseAttempt(
  questionsSnapshot: CourseQuestionSource[],
  submitted: SubmittedCourseAnswer[],
): CourseGradeResult {
  const submittedById = new Map(submitted.map((a) => [a.questionId, a]));

  const answers: GradedCourseAnswer[] = questionsSnapshot.map((q) => {
    const chosen = submittedById.get(q.id)?.chosenOptionIndex ?? null;
    return {
      questionId: q.id,
      chosenOptionIndex: chosen,
      isCorrect: chosen !== null && chosen === q.correctOptionIndex,
      correctOptionIndex: q.correctOptionIndex,
    };
  });

  const score = answers.filter((a) => a.isCorrect).length;

  return { answers, score, total: questionsSnapshot.length };
}
