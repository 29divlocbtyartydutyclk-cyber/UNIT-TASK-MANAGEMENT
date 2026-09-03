import { listCourseQuizResults, deleteCourseQuizResult } from "@/app/actions/course-results";

export default async function CourseAdminResultsPage() {
  const attempts = await listCourseQuizResults();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-study-800">Quiz Results</h1>
        <p className="text-sm text-parchment-600 mt-1">
          Visible only to admin. Participants enter their name and service number before taking a quiz.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
        {attempts.length === 0 && <p className="p-4 text-sm text-parchment-500">No quiz attempts yet.</p>}
        {attempts.map((a) => (
          <div key={a.id} className="p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-study-800">
                {a.participantName} <span className="text-parchment-500 font-normal">({a.participantServiceNumber})</span>
              </p>
              <p className="text-xs text-parchment-500">
                {a.quiz.course.title} &middot; {a.quiz.title} &middot;{" "}
                {a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "-"}
                {a.status === "EXPIRED" ? " (time expired)" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-semibold text-study-700">
                {a.score} / {a.totalQuestions}
              </span>
              <form action={deleteCourseQuizResult.bind(null, a.id)}>
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
