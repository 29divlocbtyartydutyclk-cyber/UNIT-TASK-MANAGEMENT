export type CourseQuestionSource = {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionIndex: number;
  explanation: string | null;
};

/** Fisher-Yates shuffle, does not mutate the input array. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Picks a random subset of `count` questions (or all of them if the bank is smaller). */
export function pickRandomQuestions(bank: CourseQuestionSource[], count: number): CourseQuestionSource[] {
  return shuffle(bank).slice(0, Math.min(count, bank.length));
}

export type SanitizedCourseQuestion = Pick<
  CourseQuestionSource,
  "id" | "text" | "optionA" | "optionB" | "optionC" | "optionD"
>;

/** Strips the correct-answer/explanation fields before sending questions to the client. */
export function sanitizeQuestions(questions: CourseQuestionSource[]): SanitizedCourseQuestion[] {
  return questions.map(({ id, text, optionA, optionB, optionC, optionD }) => ({
    id,
    text,
    optionA,
    optionB,
    optionC,
    optionD,
  }));
}
