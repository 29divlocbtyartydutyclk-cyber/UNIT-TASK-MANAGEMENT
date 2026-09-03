import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-combat-800">Choose a function</h1>
          <p className="text-sm text-sand-600 mt-1">Select which part of the app you want to open.</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/login"
            className="block rounded-lg bg-white shadow p-5 text-left hover:shadow-md border border-transparent hover:border-combat-300 transition"
          >
            <p className="font-semibold text-combat-800">Unit Task Management</p>
            <p className="text-sm text-sand-600 mt-1">Daily task tracking, calendar, and unit dashboard.</p>
          </Link>

          <Link
            href="/course/login"
            className="block rounded-lg bg-white shadow p-5 text-left hover:shadow-md border border-transparent hover:border-study-300 transition"
          >
            <p className="font-semibold text-study-800">E Pre Course</p>
            <p className="text-sm text-sand-600 mt-1">
              Course materials and quizzes for Officers, JCOs, and Other Ranks.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
