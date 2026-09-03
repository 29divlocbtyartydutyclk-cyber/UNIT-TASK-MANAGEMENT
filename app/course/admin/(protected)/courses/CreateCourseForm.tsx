"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/app/actions/course-courses";
import { COURSE_CATEGORIES, COURSE_CATEGORY_LABELS, type CourseCategoryValue } from "@/lib/course/constants";

export default function CreateCourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CourseCategoryValue | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!category) {
      setError("Select a category");
      return;
    }
    startTransition(async () => {
      const result = await createCourse({ title, category, description, order: 0 });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setTitle("");
      setCategory("");
      setDescription("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-study-800">New Course</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CourseCategoryValue)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Select category
          </option>
          {COURSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {COURSE_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
        rows={2}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-study-600 text-white text-sm px-4 py-2 hover:bg-study-700 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}
