import { getAllTasks } from "@/lib/data/tasks";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { isToday, nextNDays, today, formatDayHeading, formatHeaderDate } from "@/lib/utils/date";
import { SummaryTile } from "@/components/dashboard/SummaryTile";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task } from "@prisma/client";

function TaskCardGrid({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const tasks = await getAllTasks();

  const todaysTasks = tasks.filter((t) => isToday(t.date));
  const overdueTasks = tasks.filter((t) => getDisplayStatus(t) === "Overdue");
  const pendingCount = tasks.filter((t) => getDisplayStatus(t) === "Pending").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const aBranchCount = tasks.filter((t) => t.branch === "A Branch").length;
  const qBranchCount = tasks.filter((t) => t.branch === "Q Branch").length;
  const gBranchCount = tasks.filter((t) => t.branch === "G Branch").length;

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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <SummaryTile label="Today's Total" value={todaysTasks.length} />
        <SummaryTile label="A Branch" value={aBranchCount} />
        <SummaryTile label="Q Branch" value={qBranchCount} />
        <SummaryTile label="G Branch" value={gBranchCount} />
        <SummaryTile label="Pending" value={pendingCount} />
        <SummaryTile label="Completed" value={completedCount} accent="text-combat-600" />
        <SummaryTile label="Overdue" value={overdueTasks.length} accent="text-red-600" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-sand-800">Today&apos;s Tasks</h2>
        {todaysTasks.length === 0 ? (
          <p className="mt-2 text-sm text-sand-500">No tasks scheduled for today.</p>
        ) : (
          <div className="mt-3">
            <TaskCardGrid tasks={todaysTasks} />
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-sand-800">Upcoming Tasks (Next 7 Days)</h2>
        {upcomingGroups.length === 0 ? (
          <p className="mt-2 text-sm text-sand-500">No upcoming tasks in the next 7 days.</p>
        ) : (
          <div className="mt-3 space-y-6">
            {upcomingGroups.map((group) => (
              <div key={group.date.toDateString()}>
                <h3 className="text-sm font-semibold tracking-wide text-sand-600">{formatDayHeading(group.date)}</h3>
                <div className="mt-2">
                  <TaskCardGrid tasks={group.tasks} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-red-700">Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p className="mt-2 text-sm text-sand-500">No overdue tasks.</p>
        ) : (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <TaskCardGrid tasks={overdueTasks} />
          </div>
        )}
      </section>
    </div>
  );
}
