"use client";

import { useState } from "react";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PlusIcon } from "@/components/layout/icons";

export function AddTaskButton({ defaultDate }: { defaultDate?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-combat-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-combat-700"
      >
        <PlusIcon className="h-4 w-4" />
        Add Task
      </button>
      <TaskFormDialog open={open} onClose={() => setOpen(false)} title="Add Task">
        <TaskForm mode="create" defaultDate={defaultDate} onSuccess={() => setOpen(false)} />
      </TaskFormDialog>
    </>
  );
}
