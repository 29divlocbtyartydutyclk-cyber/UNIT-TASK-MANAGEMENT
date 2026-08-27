import type { Task } from "@prisma/client";
import { TaskListTable } from "@/components/tasks/TaskListTable";
import { TaskCard } from "@/components/tasks/TaskCard";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="py-8 text-center text-sand-500">No tasks found.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-sand-200 bg-white p-4 md:block">
        <TaskListTable tasks={tasks} />
      </div>
      <div className="grid gap-3 md:hidden">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
}
