import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-red-800 px-4 py-10">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="text-white">
          <p className="text-lg font-semibold tracking-widest">WELCOME</p>
          <p className="text-2xl font-bold leading-tight mt-1">29 DIVISION LOCATING BATTERY</p>
          <p className="text-2xl font-bold leading-tight">MANAGEMENT APP</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/login"
            className="block rounded-lg bg-combat-600 shadow-lg p-5 text-left hover:bg-combat-700 border border-white/20 transition"
          >
            <p className="font-semibold text-white">Unit Task Management</p>
            <p className="text-sm text-combat-100 mt-1">Daily task tracking, calendar, and unit dashboard.</p>
          </Link>

          <Link
            href="/course"
            className="block rounded-lg bg-study-600 shadow-lg p-5 text-left hover:bg-study-700 border border-white/20 transition"
          >
            <p className="font-semibold text-white">E Pre Course</p>
            <p className="text-sm text-study-100 mt-1">
              Course materials and quizzes for Officers, JCOs, and Other Ranks.
            </p>
          </Link>

          <Link
            href="/vts"
            className="block rounded-lg bg-red-700 shadow-lg p-5 text-left hover:bg-red-800 border border-white/20 transition"
          >
            <p className="font-semibold text-white">Vehicle Tracking System</p>
            <p className="text-sm text-red-100 mt-1">Live vehicle movement monitoring for drivers and admin.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
