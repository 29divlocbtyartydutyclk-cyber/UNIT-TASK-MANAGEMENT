import type { Task } from "@prisma/client";
import { TaskListTable } from "@/components/tasks/TaskListTable";
import { TaskCard } from "@/components/tasks/TaskCard";
import { BRANCH_ROW_COLOR } from "@/lib/constants";

function RowColorLegend() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-sand-600">
      <span className="font-medium uppercase tracking-wide text-sand-500">Row colour:</span>
      {Object.entries(BRANCH_ROW_COLOR).map(([label, color]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-sand-300" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="py-8 text-center text-sand-500">No tasks found.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-sand-200 bg-white p-4 md:block">
        <RowColorLegend />
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
