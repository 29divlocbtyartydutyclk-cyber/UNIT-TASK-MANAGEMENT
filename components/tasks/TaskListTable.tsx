import type { Task } from "@prisma/client";
import { CategoryBadge } from "@/components/tasks/CategoryBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { TaskRowActions } from "@/components/tasks/TaskRowActions";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { formatDateRange } from "@/lib/utils/date";
import { formatBranches, type Category, type Priority } from "@/lib/constants";

export function TaskListTable({ tasks }: { tasks: Task[] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-sand-500">
        <tr>
          <th className="py-2 pr-4 font-medium">Date</th>
          <th className="py-2 pr-4 font-medium">Task</th>
          <th className="py-2 pr-4 font-medium">Branch</th>
          <th className="py-2 pr-4 font-medium">Category</th>
          <th className="py-2 pr-4 font-medium">Responsible</th>
          <th className="py-2 pr-4 font-medium">Priority</th>
          <th className="py-2 pr-4 font-medium">Status</th>
          <th className="py-2 pr-4 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const displayStatus = getDisplayStatus(task);
          return (
            <tr key={task.id} className="border-b border-sand-100 align-top">
              <td className="py-3 pr-4 whitespace-nowrap">
                {formatDateRange(task.date, task.endDate)}
                {task.time ? ` · ${task.time}` : ""}
              </td>
              <td className="py-3 pr-4 font-medium uppercase text-sand-900">{task.title}</td>
              <td className="py-3 pr-4 whitespace-nowrap">{formatBranches(task.branches)}</td>
              <td className="py-3 pr-4">
                <CategoryBadge category={task.category as Category} />
              </td>
              <td className="py-3 pr-4">{task.responsiblePerson || "—"}</td>
              <td className="py-3 pr-4">
                <PriorityBadge priority={task.priority as Priority} />
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={displayStatus} />
              </td>
              <td className="py-3 pr-4">
                <TaskRowActions task={task} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
