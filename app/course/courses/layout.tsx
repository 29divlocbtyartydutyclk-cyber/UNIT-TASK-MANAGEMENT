import { redirect } from "next/navigation";
import { getCourseSession } from "@/lib/course/auth/server";
import { courseLogout } from "@/app/actions/course-auth";
import { COURSE_CATEGORY_LABELS } from "@/lib/course/constants";

export default async function CourseParticipantLayout({ children }: { children: React.ReactNode }) {
  const session = await getCourseSession();
  if (!session || session.role !== "PARTICIPANT" || session.status !== "APPROVED" || !session.category) {
    redirect("/course/login");
  }

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="bg-combat-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-semibold">E Pre Course</p>
            <p className="text-xs text-combat-200">{COURSE_CATEGORY_LABELS[session.category]}</p>
          </div>
          <form action={courseLogout}>
            <button type="submit" className="text-sm hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
