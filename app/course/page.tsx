import Link from "next/link";

export default function CourseLandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-study-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-study-900">E Pre Course</h1>
          <p className="text-sm text-parchment-600 mt-1">Are you a participant or admin?</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/course/participant"
            className="block rounded-lg bg-white shadow p-5 hover:shadow-md border border-transparent hover:border-study-400 transition"
          >
            <p className="font-semibold text-study-900">Participant</p>
            <p className="text-sm text-parchment-600 mt-1">Officers, JCOs, and Other Ranks - view courses and take quizzes. No login needed.</p>
          </Link>

          <Link
            href="/course/admin/login"
            className="block rounded-lg bg-white shadow p-5 hover:shadow-md border border-transparent hover:border-study-400 transition"
          >
            <p className="font-semibold text-study-900">Admin</p>
            <p className="text-sm text-parchment-600 mt-1">Manage courses, materials, quizzes, and approvals.</p>
          </Link>
        </div>

        <Link href="/" className="inline-block text-sm text-parchment-500">
          &larr; Back to app selection
        </Link>
      </div>
    </main>
  );
}
