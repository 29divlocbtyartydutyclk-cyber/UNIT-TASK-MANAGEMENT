import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourseSession } from "@/lib/course/auth/server";
import { courseLogout } from "@/app/actions/course-auth";

export default async function CourseAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCourseSession();
  if (!session || session.role !== "ADMIN") redirect("/course/login");

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="bg-combat-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold">E Pre Course · Admin</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/course/admin/courses" className="hover:underline">
                Courses
              </Link>
              <Link href="/course/admin/users" className="hover:underline">
                Pending Users
              </Link>
              <Link href="/course/admin/settings" className="hover:underline">
                Settings
              </Link>
            </nav>
          </div>
          <form action={courseLogout}>
            <button type="submit" className="text-sm hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
