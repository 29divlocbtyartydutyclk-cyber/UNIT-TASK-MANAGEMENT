import type { Task } from "@prisma/client";
import { CategoryBadge } from "@/components/tasks/CategoryBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { TaskRowActions } from "@/components/tasks/TaskRowActions";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { formatDateRange } from "@/lib/utils/date";
import { formatBranches, getBranchRowColor, type Category, type Priority } from "@/lib/constants";

const thClass = "border border-combat-800 px-3 py-2 text-left font-medium";
const tdClass = "border border-sand-300 px-3 py-2 align-top";

export function TaskListTable({ tasks }: { tasks: Task[] }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="bg-combat-700 text-xs uppercase tracking-wide text-sand-50">
        <tr>
          <th className={thClass}>Date</th>
          <th className={thClass}>Task</th>
          <th className={thClass}>Branch</th>
          <th className={thClass}>Category</th>
          <th className={thClass}>Responsible</th>
          <th className={thClass}>Priority</th>
          <th className={thClass}>Status</th>
          <th className={thClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const displayStatus = getDisplayStatus(task);
          return (
            <tr key={task.id} style={{ backgroundColor: getBranchRowColor(task.branches) }}>
              <td className={`${tdClass} whitespace-nowrap`}>
                {formatDateRange(task.date, task.endDate)}
                {task.time ? ` · ${task.time}` : ""}
              </td>
              <td className={`${tdClass} font-medium uppercase text-sand-900`}>{task.title}</td>
              <td className={`${tdClass} whitespace-nowrap`}>{formatBranches(task.branches)}</td>
              <td className={tdClass}>
                <CategoryBadge category={task.category as Category} />
              </td>
              <td className={tdClass}>{task.responsiblePerson || "—"}</td>
              <td className={tdClass}>
                <PriorityBadge priority={task.priority as Priority} />
              </td>
              <td className={tdClass}>
                <StatusBadge status={displayStatus} />
              </td>
              <td className={tdClass}>
                <TaskRowActions task={task} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
