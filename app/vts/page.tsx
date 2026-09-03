import Link from "next/link";

export default function VtsLandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">Vehicle Tracking System</h1>
          <p className="text-sm text-parchment-600 mt-1">Are you signing in as a driver or as admin?</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/vts/driver/login"
            className="block rounded-lg bg-white shadow p-5 hover:shadow-md border border-transparent hover:border-amber-400 transition"
          >
            <p className="font-semibold text-amber-900">Driver</p>
            <p className="text-sm text-parchment-600 mt-1">Start and track your movement.</p>
          </Link>

          <Link
            href="/vts/admin/login"
            className="block rounded-lg bg-white shadow p-5 hover:shadow-md border border-transparent hover:border-amber-400 transition"
          >
            <p className="font-semibold text-amber-900">Admin</p>
            <p className="text-sm text-parchment-600 mt-1">Monitor the live fleet and manage records.</p>
          </Link>
        </div>

        <Link href="/" className="inline-block text-sm text-parchment-500">
          &larr; Back to app selection
        </Link>
      </div>
    </main>
  );
}
