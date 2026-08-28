import { getAllTasks } from "@/lib/data/tasks";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { filterTasks, parseTaskFilters } from "@/lib/utils/filter-tasks";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; category?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const filters = parseTaskFilters(params);
  const tasks = await getAllTasks();
  const filteredTasks = filterTasks(tasks, filters);

  return (
    <div className="min-h-full bg-[#D4DE95]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-combat-800">Tasks</h1>
          <AddTaskButton />
        </div>
        <div className="mt-4">
          <TaskFilters />
        </div>
        <div className="mt-4">
          <TaskList tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}
