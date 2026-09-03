"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCourseQuestion } from "@/app/actions/course-questions";

const EMPTY = { text: "", optionA: "", optionB: "", optionC: "", optionD: "", explanation: "" };

export default function AddQuestionForm({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [fields, setFields] = useState(EMPTY);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const options: { key: keyof typeof EMPTY; label: string }[] = [
    { key: "optionA", label: "Option A" },
    { key: "optionB", label: "Option B" },
    { key: "optionC", label: "Option C" },
    { key: "optionD", label: "Option D" },
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCourseQuestion({ quizId, ...fields, correctOptionIndex });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setFields(EMPTY);
      setCorrectOptionIndex(0);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="font-medium text-study-800">Add Question</h3>
      <textarea
        placeholder="Question text"
        value={fields.text}
        onChange={(e) => setFields({ ...fields, text: e.target.value })}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        rows={2}
        required
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="correctOption"
              checked={correctOptionIndex === i}
              onChange={() => setCorrectOptionIndex(i)}
            />
            <input
              type="text"
              placeholder={opt.label}
              value={fields[opt.key]}
              onChange={(e) => setFields({ ...fields, [opt.key]: e.target.value })}
              className="flex-1 rounded border border-parchment-300 px-3 py-2 text-sm"
              required
            />
          </label>
        ))}
      </div>
      <p className="text-xs text-parchment-500">Select the radio button next to the correct option.</p>
      <textarea
        placeholder="Explanation (optional, shown after submit)"
        value={fields.explanation}
        onChange={(e) => setFields({ ...fields, explanation: e.target.value })}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        rows={2}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-study-600 text-white text-sm px-4 py-2 hover:bg-study-700 disabled:opacity-60"
      >
        {isPending ? "Adding..." : "Add Question"}
      </button>
    </form>
  );
}
