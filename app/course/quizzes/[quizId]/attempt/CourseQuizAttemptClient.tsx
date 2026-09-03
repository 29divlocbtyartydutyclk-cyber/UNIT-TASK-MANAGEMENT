"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { startCourseAttempt, submitCourseAttempt } from "@/app/actions/course-attempts";
import type { SanitizedCourseQuestion } from "@/lib/course/quiz/randomize";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

type StartedState = {
  attemptId: string;
  timeLimitSeconds: number;
  secondsElapsed: number;
  questions: SanitizedCourseQuestion[];
};

export default function CourseQuizAttemptClient({ quizId, quizTitle }: { quizId: string; quizTitle: string }) {
  const [participantName, setParticipantName] = useState("");
  const [participantServiceNumber, setParticipantServiceNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startStartTransition] = useTransition();
  const [started, setStarted] = useState<StartedState | null>(null);

  function onStart(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startStartTransition(async () => {
      const result = await startCourseAttempt({ quizId, participantName, participantServiceNumber });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setStarted({
        attemptId: result.attemptId,
        timeLimitSeconds: result.timeLimitSeconds,
        secondsElapsed: result.secondsElapsed,
        questions: result.questions,
      });
    });
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 px-4">
        <form onSubmit={onStart} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-study-800">{quizTitle}</h1>
            <p className="text-sm text-parchment-600 mt-1">
              Enter your name and service number before starting - this is required so admin can identify your result.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Name</label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Service Number</label>
            <input
              type="text"
              value={participantServiceNumber}
              onChange={(e) => setParticipantServiceNumber(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isStarting}
            className="w-full rounded bg-study-600 text-white py-2.5 font-medium hover:bg-study-700 disabled:opacity-60"
          >
            {isStarting ? "Starting..." : "Start Quiz"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <QuizInProgress
      quizTitle={quizTitle}
      attemptId={started.attemptId}
      timeLimitSeconds={started.timeLimitSeconds}
      secondsElapsed={started.secondsElapsed}
      questions={started.questions}
    />
  );
}

function QuizInProgress({
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
