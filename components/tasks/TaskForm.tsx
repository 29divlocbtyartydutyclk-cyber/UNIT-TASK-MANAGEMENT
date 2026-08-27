"use client";

import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import type { Task } from "@prisma/client";
import { BRANCHES, CATEGORIES, PRIORITIES, type Branch, type Category, type Priority } from "@/lib/constants";
import { createTask, updateTask } from "@/app/actions/tasks";

const inputClass =
  "mt-1 w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500";
const labelClass = "block text-sm font-medium text-sand-700";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  defaultDate?: string;
  onSuccess: () => void;
}

export function TaskForm({ mode, task, defaultDate, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [date, setDate] = useState(
    task ? format(task.date, "yyyy-MM-dd") : defaultDate ?? format(new Date(), "yyyy-MM-dd")
  );
  const [time, setTime] = useState(task?.time ?? "");
  const [branch, setBranch] = useState<Branch | "">((task?.branch as Branch) ?? "");
  const [category, setCategory] = useState<Category | "">((task?.category as Category) ?? "");
  const [responsiblePerson, setResponsiblePerson] = useState(task?.responsiblePerson ?? "");
  const [priority, setPriority] = useState<Priority>((task?.priority as Priority) ?? "Normal");
  const [remarks, setRemarks] = useState(task?.remarks ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = { title, date, time, branch, category, responsiblePerson, priority, remarks };
    const result = mode === "create" ? await createTask(data) : await updateTask(task!.id, data);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div>
        <label className={labelClass}>Task Name *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Date *</label>
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Branch *</label>
          <select
            required
            value={branch}
            onChange={(e) => setBranch(e.target.value as Branch)}
            className={inputClass}
          >
            <option value="" disabled>
              Select branch
            </option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Responsible Person</label>
          <input
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Remarks</label>
        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className={inputClass} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-combat-600 px-4 py-2 text-sm font-semibold text-white hover:bg-combat-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
