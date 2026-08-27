"use client";

import { useState } from "react";
import type { Task } from "@prisma/client";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { getDisplayStatus } from "@/lib/utils/task-status";
import type { DisplayStatus } from "@/lib/constants";

const BAR_COLORS: Partial<Record<DisplayStatus, string>> = {
  Completed: "bg-green-200 text-green-900 hover:bg-green-300",
  Pending: "bg-red-200 text-red-900 hover:bg-red-300",
};
const DEFAULT_BAR_COLOR = "bg-sky-200 text-sky-900 hover:bg-sky-300";

export function TodaysTasksBlock({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return <p className="text-sm text-sand-500">No tasks scheduled for today.</p>;
  }

  return (
    <div className="space-y-2 rounded-lg border border-sand-200 bg-white p-3">
      {tasks.map((task) => {
        const displayStatus = getDisplayStatus(task);
        const colorClass = BAR_COLORS[displayStatus] ?? DEFAULT_BAR_COLOR;
        return (
          <button
            type="button"
            key={task.id}
            onClick={() => setSelected(task)}
            className={`block w-full truncate rounded-md px-4 py-2.5 text-left text-sm font-semibold uppercase transition-colors ${colorClass}`}
          >
            {task.title}
          </button>
        );
      })}
      {selected && <TaskDetailDialog task={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
