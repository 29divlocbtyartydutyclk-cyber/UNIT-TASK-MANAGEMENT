"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCourseQuiz } from "@/app/actions/course-quizzes";

export default function CreateQuizForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [questionsPerAttempt, setQuestionsPerAttempt] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCourseQuiz({
        courseId,
        title,
        timeLimitSeconds: timeLimitMinutes * 60,
        questionsPerAttempt,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setTitle("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="font-medium text-study-800">New Quiz</h3>
      <input
        type="text"
        placeholder="Quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-parchment-700">
          Time limit (minutes)
          <input
            type="number"
            min={1}
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
            className="mt-1 w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="text-sm text-parchment-700">
          Questions per attempt
          <input
            type="number"
            min={1}
            value={questionsPerAttempt}
            onChange={(e) => setQuestionsPerAttempt(Number(e.target.value))}
            className="mt-1 w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            required
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-study-600 text-white text-sm px-4 py-2 hover:bg-study-700 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
}
