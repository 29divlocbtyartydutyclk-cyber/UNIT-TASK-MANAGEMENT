"use client";

import { useState, useTransition } from "react";
import type { Task } from "@prisma/client";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { deleteTask, updateTaskStatus } from "@/app/actions/tasks";
import type { DisplayStatus } from "@/lib/constants";

export function TaskRowActions({ task, displayStatus }: { task: Task; displayStatus: DisplayStatus }) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      await updateTaskStatus(task.id, "Completed");
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteTask(task.id);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setEditOpen(true)} className="text-xs font-medium text-combat-700 hover:underline">
        Edit
      </button>
      {displayStatus !== "Completed" && (
        <button
          type="button"
          onClick={handleComplete}
          disabled={isPending}
          className="text-xs font-medium text-combat-700 hover:underline disabled:opacity-50"
        >
          Complete
        </button>
      )}
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
