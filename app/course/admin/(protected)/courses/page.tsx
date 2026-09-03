import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COURSE_CATEGORIES, COURSE_CATEGORY_LABELS, COURSE_CATEGORY_COLORS } from "@/lib/course/constants";
import CreateCourseForm from "./CreateCourseForm";

export default async function CourseAdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
    include: { _count: { select: { documents: true, quizzes: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-study-800">Courses</h1>
      <CreateCourseForm />

      {COURSE_CATEGORIES.map((category) => {
        const categoryCourses = courses.filter((c) => c.category === category);
        return (
          <div key={category} className="space-y-2">
            <h2 className={`text-sm font-semibold ${COURSE_CATEGORY_COLORS[category].text}`}>
              {COURSE_CATEGORY_LABELS[category]}
            </h2>
            {categoryCourses.length === 0 ? (
              <p className="text-sm text-parchment-500">No courses yet.</p>
            ) : (
              <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
                {categoryCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/admin/courses/${course.id}`}
                    className="flex items-center justify-between p-4 hover:bg-parchment-50"
                  >
                    <div>
                      <p className="font-medium text-study-800">
                        {course.title}
                        {!course.isPublished && (
                          <span className="ml-2 text-xs text-parchment-500">(unpublished)</span>
                        )}
                      </p>
                      <p className="text-sm text-parchment-600">
                        {course._count.documents} document{course._count.documents === 1 ? "" : "s"} ·{" "}
                        {course._count.quizzes} quiz{course._count.quizzes === 1 ? "" : "zes"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
