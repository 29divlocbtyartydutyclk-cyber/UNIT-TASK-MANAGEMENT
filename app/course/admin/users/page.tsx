import { prisma } from "@/lib/prisma";
import { COURSE_CATEGORY_LABELS } from "@/lib/course/constants";
import { approveCourseUser, rejectCourseUser } from "@/app/actions/course-users";

export default async function CourseAdminUsersPage() {
  const pendingUsers = await prisma.courseUser.findMany({
    where: { role: "PARTICIPANT", status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-study-800">Pending Approvals</h1>

      {pendingUsers.length === 0 ? (
        <p className="text-sm text-parchment-600">No accounts awaiting approval.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
          {pendingUsers.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-study-800">
                  {user.name} <span className="text-parchment-500 font-normal">({user.serviceNumber})</span>
                </p>
                <p className="text-sm text-parchment-600">
                  {user.rank ? `${user.rank} · ` : ""}
                  {user.category ? COURSE_CATEGORY_LABELS[user.category] : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <form action={approveCourseUser.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="rounded bg-study-600 text-white text-sm px-3 py-1.5 hover:bg-study-700"
                  >
                    Approve
                  </button>
                </form>
                <form action={rejectCourseUser.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="rounded bg-red-50 text-red-700 text-sm px-3 py-1.5 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
