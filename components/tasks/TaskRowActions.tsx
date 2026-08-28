"use client";

import { useState, useTransition } from "react";
import type { Task } from "@prisma/client";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { StatusSelect } from "@/components/tasks/StatusSelect";
import { deleteTask, updateTaskStatus } from "@/app/actions/tasks";
import { useCanEdit } from "@/components/auth/RoleProvider";
import type { Status } from "@/lib/constants";

export function TaskRowActions({ task }: { task: Task }) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const canEdit = useCanEdit();

  function handleStatusChange(status: Status) {
    startTransition(async () => {
      await updateTaskStatus(task.id, status);
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteTask(task.id);
    });
  }

  if (!canEdit) {
    return <span className="text-xs text-sand-400">View only</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusSelect value={task.status} onChange={handleStatusChange} disabled={isPending} />
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="text-xs font-medium text-combat-700 hover:underline"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
      <TaskFormDialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm mode="edit" task={task} onSuccess={() => setEditOpen(false)} />
      </TaskFormDialog>
    </div>
  );
}
