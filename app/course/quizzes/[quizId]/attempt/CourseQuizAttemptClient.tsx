"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { submitCourseAttempt } from "@/app/actions/course-attempts";
import type { SanitizedCourseQuestion } from "@/lib/course/quiz/randomize";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default function CourseQuizAttemptClient({
  quizTitle,
  attemptId,
  timeLimitSeconds,
  secondsElapsed,
  questions,
}: {
  quizTitle: string;
  attemptId: string;
  timeLimitSeconds: number;
  secondsElapsed: number;
  questions: SanitizedCourseQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(Math.max(0, timeLimitSeconds - secondsElapsed));
  const [isPending, startTransition] = useTransition();
  const submittedRef = useRef(false);

  const options = useMemo(
    () => (q: SanitizedCourseQuestion) => [q.optionA, q.optionB, q.optionC, q.optionD],
    [],
  );

  function doSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const payload = {
      attemptId,
      answers: questions.map((q) => ({
        questionId: q.id,
        chosenOptionIndex: answers[q.id] ?? null,
      })),
    };
    startTransition(async () => {
      await submitCourseAttempt(payload);
    });
  }

  useEffect(() => {
    if (secondsLeft <= 0) {
      doSubmit();
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft <= 0]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="sticky top-0 bg-combat-800 text-white px-4 py-3 flex items-center justify-between z-10">
        <div>
          <p className="font-semibold">{quizTitle}</p>
          <p className="text-xs text-combat-200">
            {answeredCount} / {questions.length} answered
          </p>
        </div>
        <span className={`font-mono text-lg ${secondsLeft <= 30 ? "text-red-300" : ""}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-lg shadow p-4 space-y-2">
            <p className="font-medium text-study-800">
              {idx + 1}. {q.text}
            </p>
            <div className="space-y-1">
              {options(q).map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-parchment-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                  />
                  <span>
                    {OPTION_LABELS[i]}. {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={doSubmit}
          disabled={isPending}
          className="w-full rounded bg-study-600 text-white py-2.5 font-medium hover:bg-study-700 disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit Quiz"}
        </button>
      </main>
    </div>
  );
}
