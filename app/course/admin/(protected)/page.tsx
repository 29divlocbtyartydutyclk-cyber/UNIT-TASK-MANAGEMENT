import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CourseAdminHomePage() {
  const [courseCount, quizCount, attemptCount] = await Promise.all([
    prisma.course.count(),
    prisma.courseQuiz.count(),
    prisma.courseQuizAttempt.count({ where: { status: { in: ["SUBMITTED", "EXPIRED"] } } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-study-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/course/admin/courses" className="bg-white rounded-lg shadow p-4 hover:shadow-md">
          <p className="text-sm text-parchment-600">Courses</p>
          <p className="text-2xl font-semibold text-study-700">{courseCount}</p>
        </Link>
        <Link href="/course/admin/courses" className="bg-white rounded-lg shadow p-4 hover:shadow-md">
          <p className="text-sm text-parchment-600">Quizzes</p>
          <p className="text-2xl font-semibold text-study-700">{quizCount}</p>
        </Link>
        <Link href="/course/admin/results" className="bg-white rounded-lg shadow p-4 hover:shadow-md">
          <p className="text-sm text-parchment-600">Quiz Attempts</p>
          <p className="text-2xl font-semibold text-study-700">{attemptCount}</p>
        </Link>
      </div>
    </div>
  );
}
