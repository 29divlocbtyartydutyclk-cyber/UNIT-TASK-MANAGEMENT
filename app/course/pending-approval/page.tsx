import { courseLogout } from "@/app/actions/course-auth";

export default function CoursePendingApprovalPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-study-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-xl font-semibold text-study-800 mb-2">Awaiting Approval</h1>
        <p className="text-sm text-parchment-600 mb-6">
          Your registration has been received. An admin needs to approve your account before you can sign in.
          Please check back later.
        </p>
        <form action={courseLogout}>
          <button
            type="submit"
            className="w-full rounded bg-parchment-200 text-parchment-800 py-2 text-sm font-medium hover:bg-parchment-300"
          >
            Back to login
          </button>
        </form>
      </div>
    </main>
  );
}
