"use client";

import { useState } from "react";
import type { Task } from "@prisma/client";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { getDisplayStatus } from "@/lib/utils/task-status";
import type { DisplayStatus } from "@/lib/constants";

const BAR_COLORS: Partial<Record<DisplayStatus, string>> = {
  Completed: "bg-green-300 text-green-950 hover:bg-green-400",
  Pending: "bg-red-300 text-red-950 hover:bg-red-400",
  Overdue: "bg-red-400 text-red-950 hover:bg-red-500",
};
const DEFAULT_BAR_COLOR = "bg-sky-300 text-sky-950 hover:bg-sky-400";
const NEUTRAL_BAR_COLOR = "border border-sand-300 bg-sand-100 text-sand-800 hover:bg-sand-200";

export function TaskBarList({
  tasks,
  emptyMessage = "No tasks found.",
  colorMode = "status",
  maxHeightClass = "",
}: {
  tasks: Task[];
  emptyMessage?: string;
  colorMode?: "status" | "neutral";
  maxHeightClass?: string;
}) {
  const [selected, setSelected] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return <p className="text-sm text-sand-500">{emptyMessage}</p>;
  }

  return (
    <div className={`space-y-2 overflow-y-auto rounded-lg border border-sand-200 bg-white p-3 ${maxHeightClass}`}>
      {tasks.map((task) => {
        const displayStatus = getDisplayStatus(task);
        const colorClass =
          colorMode === "neutral" ? NEUTRAL_BAR_COLOR : (BAR_COLORS[displayStatus] ?? DEFAULT_BAR_COLOR);
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
