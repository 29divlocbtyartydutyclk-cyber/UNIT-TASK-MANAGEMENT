"use client";

import { useState } from "react";
import type { Task } from "@prisma/client";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CategoryBadge } from "@/components/tasks/CategoryBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusSelect } from "@/components/tasks/StatusSelect";
import { updateTaskStatus } from "@/app/actions/tasks";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { formatShortDate } from "@/lib/utils/date";
import type { Category, Priority, Status } from "@/lib/constants";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-sand-500">{label}</p>
      <p className="text-sand-800">{value}</p>
    </div>
  );
}

export function TaskDetailDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const displayStatus = getDisplayStatus(task);

  if (editing) {
    return (
      <TaskFormDialog open onClose={onClose} title="Edit Task">
        <TaskForm mode="edit" task={task} onSuccess={onClose} />
      </TaskFormDialog>
    );
  }

  async function handleStatusChange(status: Status) {
    setPending(true);
    await updateTaskStatus(task.id, status);
    setPending(false);
    onClose();
  }

  return (
    <TaskFormDialog open onClose={onClose} title={task.title}>
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={task.category as Category} />
          <PriorityBadge priority={task.priority as Priority} />
          <StatusBadge status={displayStatus} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Date" value={formatShortDate(task.date)} />
          <Field label="Time" value={task.time || "—"} />
          <Field label="Branch" value={task.branch} />
          <Field label="Responsible Person" value={task.responsiblePerson || "—"} />
        </div>
        {task.remarks && <Field label="Remarks" value={task.remarks} />}
        <div className="flex items-center justify-between gap-2 pt-2">
          <StatusSelect value={task.status} onChange={handleStatusChange} disabled={pending} />
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-sand-300 px-3 py-1.5 text-sm font-medium text-sand-700 hover:bg-sand-50"
          >
            Edit
          </button>
        </div>
      </div>
    </TaskFormDialog>
  );
}
