import { getAllTasks } from "@/lib/data/tasks";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { isTaskActiveToday, nextNDays, today, formatDayHeading, formatHeaderDate } from "@/lib/utils/date";
import { parseBranches } from "@/lib/constants";
import { SummaryTile } from "@/components/dashboard/SummaryTile";
import { TaskBarList } from "@/components/dashboard/TaskBarList";
import type { Task } from "@prisma/client";

export default async function DashboardPage() {
  const tasks = await getAllTasks();

  const todaysTasks = tasks.filter(isTaskActiveToday);
  const overdueTasks = tasks.filter((t) => getDisplayStatus(t) === "Overdue");
  const pendingCount = tasks.filter((t) => getDisplayStatus(t) === "Pending").length;
  const inProgressCount = tasks.filter((t) => getDisplayStatus(t) === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const aBranchCount = tasks.filter((t) => parseBranches(t.branches).includes("A Branch")).length;
  const qBranchCount = tasks.filter((t) => parseBranches(t.branches).includes("Q Branch")).length;
  const gBranchCount = tasks.filter((t) => parseBranches(t.branches).includes("G Branch")).length;

  const todayStart = today();
  const { end } = nextNDays(7);
  const upcomingTasks = tasks.filter((t) => t.date > todayStart && t.date <= end);

  const upcomingByDay = new Map<string, { date: Date; tasks: Task[] }>();
  for (const t of upcomingTasks) {
    const key = t.date.toDateString();
    if (!upcomingByDay.has(key)) upcomingByDay.set(key, { date: t.date, tasks: [] });
    upcomingByDay.get(key)!.tasks.push(t);
  }
  const upcomingGroups = [...upcomingByDay.values()].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-combat-800">UNIT DAILY MANAGEMENT DASHBOARD</h1>
      <p className="mt-1 text-sm text-sand-500">{formatHeaderDate(new Date())}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <SummaryTile label="Today's Total" value={todaysTasks.length} barColor="border-l-combat-500" />
        <SummaryTile label="A Branch" value={aBranchCount} barColor="border-l-blue-500" />
        <SummaryTile label="Q Branch" value={qBranchCount} barColor="border-l-purple-500" />
        <SummaryTile label="G Branch" value={gBranchCount} barColor="border-l-orange-500" />
        <SummaryTile label="Pending" value={pendingCount} barColor="border-l-slate-400" />
        <SummaryTile
          label="In Progress"
          value={inProgressCount}
          accent="text-amber-600"
          barColor="border-l-amber-500"
        />
        <SummaryTile
          label="Completed"
          value={completedCount}
          accent="text-combat-600"
          barColor="border-l-combat-600"
        />
        <SummaryTile label="Overdue" value={overdueTasks.length} accent="text-red-600" barColor="border-l-red-500" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold uppercase text-sand-800">Today&apos;s Tasks</h2>
        <div className="mt-3">
          <TaskBarList tasks={todaysTasks} emptyMessage="No tasks scheduled for today." />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold uppercase text-sand-800">Upcoming Tasks (Next 7 Days)</h2>
        {upcomingGroups.length === 0 ? (
          <p className="mt-2 text-sm text-sand-500">No upcoming tasks in the next 7 days.</p>
        ) : (
          <div className="mt-3 space-y-5">
            {upcomingGroups.map((group) => (
              <div key={group.date.toDateString()}>
                <h3 className="text-sm font-semibold tracking-wide text-sand-600">{formatDayHeading(group.date)}</h3>
                <div className="mt-2">
                  <TaskBarList tasks={group.tasks} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold uppercase text-red-700">Overdue Tasks</h2>
        <div className="mt-3">
          <TaskBarList tasks={overdueTasks} emptyMessage="No overdue tasks." />
        </div>
      </section>
    </div>
  );
}
