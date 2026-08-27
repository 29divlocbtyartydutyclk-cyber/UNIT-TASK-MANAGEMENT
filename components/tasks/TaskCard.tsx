import type { Task } from "@prisma/client";
import { CategoryBadge } from "@/components/tasks/CategoryBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { TaskRowActions } from "@/components/tasks/TaskRowActions";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { formatShortDate } from "@/lib/utils/date";
import type { Category, Priority } from "@/lib/constants";

export function TaskCard({ task }: { task: Task }) {
  const displayStatus = getDisplayStatus(task);

  return (
    <div className="rounded-lg border border-sand-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sand-900">{task.title}</p>
          <p className="text-sm text-sand-500">
            {formatShortDate(task.date)}
            {task.time ? ` · ${task.time}` : ""}
          </p>
        </div>
        <StatusBadge status={displayStatus} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={task.category as Category} />
        <PriorityBadge priority={task.priority as Priority} />
        <span className="text-xs font-medium text-sand-600">{task.branch}</span>
      </div>
      {task.responsiblePerson && <p className="mt-2 text-sm text-sand-600">Responsible: {task.responsiblePerson}</p>}
      <div className="mt-3 border-t border-sand-100 pt-3">
        <TaskRowActions task={task} displayStatus={displayStatus} />
      </div>
    </div>
  );
}
