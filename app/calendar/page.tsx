import { format } from "date-fns";
import { getAllTasks } from "@/lib/data/tasks";
import { CalendarView } from "@/components/calendar/CalendarView";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const monthParam =
    params.month && /^\d{4}-\d{2}$/.test(params.month) ? params.month : format(new Date(), "yyyy-MM");
  const tasks = await getAllTasks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-combat-800">Calendar</h1>
      <div className="mt-4">
        <CalendarView tasks={tasks} monthParam={monthParam} />
      </div>
    </div>
  );
}
