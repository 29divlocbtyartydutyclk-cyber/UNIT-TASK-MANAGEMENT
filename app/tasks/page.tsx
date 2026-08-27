import { getAllTasks } from "@/lib/data/tasks";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskList } from "@/components/tasks/TaskList";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-combat-800">Tasks</h1>
        <AddTaskButton />
      </div>
      <div className="mt-6">
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
