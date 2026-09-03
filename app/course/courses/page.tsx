import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCourseSession } from "@/lib/course/auth/server";

export default async function CourseListPage() {
  const session = await getCourseSession();
  if (!session?.category) redirect("/course/login");

  const courses = await prisma.course.findMany({
    where: { category: session.category, isPublished: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: { _count: { select: { documents: true, quizzes: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-study-800">Courses</h1>
      {courses.length === 0 ? (
        <p className="text-sm text-parchment-600">No courses have been published for your category yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/course/courses/${course.id}`}
              className="flex items-center justify-between p-4 hover:bg-parchment-50"
            >
              <div>
                <p className="font-medium text-study-800">{course.title}</p>
                {course.description && <p className="text-sm text-parchment-600">{course.description}</p>}
              </div>
              <p className="text-xs text-parchment-500 shrink-0 ml-3">
                {course._count.documents} materials · {course._count.quizzes} quizzes
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
