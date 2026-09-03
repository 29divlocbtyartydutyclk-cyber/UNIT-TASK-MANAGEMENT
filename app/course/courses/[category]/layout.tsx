import { notFound } from "next/navigation";
import { COURSE_CATEGORIES, COURSE_CATEGORY_LABELS, type CourseCategoryValue } from "@/lib/course/constants";

export default async function CourseParticipantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!COURSE_CATEGORIES.includes(category as CourseCategoryValue)) notFound();

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="bg-combat-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <p className="font-semibold">E Pre Course</p>
          <p className="text-xs text-combat-200">{COURSE_CATEGORY_LABELS[category as CourseCategoryValue]}</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
