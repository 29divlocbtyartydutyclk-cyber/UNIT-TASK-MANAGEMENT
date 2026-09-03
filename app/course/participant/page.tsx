import Link from "next/link";
import { COURSE_CATEGORIES, COURSE_CATEGORY_LABELS, type CourseCategoryValue } from "@/lib/course/constants";

export default function CourseParticipantCategoryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-study-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-study-900">E Pre Course</h1>
          <p className="text-sm text-parchment-600 mt-1">Select your category to see your courses.</p>
        </div>

        <div className="grid gap-4">
          {COURSE_CATEGORIES.map((c: CourseCategoryValue) => (
            <Link
              key={c}
              href={`/course/courses/${c}`}
              className="block rounded-lg bg-white shadow p-5 hover:shadow-md border border-transparent hover:border-study-400 transition"
            >
              <p className="font-semibold text-study-900">{COURSE_CATEGORY_LABELS[c]}</p>
            </Link>
          ))}
        </div>

        <Link href="/course" className="inline-block text-sm text-parchment-500">
          &larr; Back
        </Link>
      </div>
    </main>
  );
}
