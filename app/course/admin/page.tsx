import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CourseAdminHomePage() {
  const [courseCount, pendingCount, quizCount] = await Promise.all([
    prisma.course.count(),
    prisma.courseUser.count({ where: { role: "PARTICIPANT", status: "PENDING" } }),
    prisma.courseQuiz.count(),
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
        <Link href="/course/admin/users" className="bg-white rounded-lg shadow p-4 hover:shadow-md">
          <p className="text-sm text-parchment-600">Pending Approvals</p>
          <p className="text-2xl font-semibold text-study-700">{pendingCount}</p>
        </Link>
      </div>
    </div>
  );
}
