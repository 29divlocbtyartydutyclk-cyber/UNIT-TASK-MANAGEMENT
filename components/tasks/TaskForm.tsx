"use client";

import { useState, type FormEvent } from "react";
import type { Task } from "@prisma/client";
import {
  BRANCHES,
  CATEGORIES,
  PRIORITIES,
  parseBranches,
  type Branch,
  type Category,
  type Priority,
} from "@/lib/constants";
import { formatDDMMYYYY, maskDateInput } from "@/lib/utils/date";
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
  const [date, setDate] = useState(task ? formatDDMMYYYY(task.date) : defaultDate ?? formatDDMMYYYY(new Date()));
  const [endDate, setEndDate] = useState(task?.endDate ? formatDDMMYYYY(task.endDate) : "");
  const [time, setTime] = useState(task?.time ?? "");
  const [branches, setBranches] = useState<Branch[]>(task ? parseBranches(task.branches) : []);
  const [category, setCategory] = useState<Category | "">((task?.category as Category) ?? "");
  const [responsiblePerson, setResponsiblePerson] = useState(task?.responsiblePerson ?? "");
  const [priority, setPriority] = useState<Priority>((task?.priority as Priority) ?? "Normal");
  const [remarks, setRemarks] = useState(task?.remarks ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleBranch(b: Branch) {
    setBranches((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (branches.length === 0) {
      setError("Select at least one branch");
      return;
    }
    setSubmitting(true);
    const data = { title, date, endDate, time, branches, category, responsiblePerson, priority, remarks };
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Date *</label>
          <input
            required
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            value={date}
            onChange={(e) => setDate(maskDateInput(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            value={endDate}
            onChange={(e) => setEndDate(maskDateInput(e.target.value))}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-sand-500">Leave blank for a single-day task</p>
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Branch * (select one or more)</label>
          <div className="mt-1 flex flex-wrap gap-3 rounded-md border border-sand-300 px-3 py-2">
            {BRANCHES.map((b) => (
              <label key={b} className="flex items-center gap-1.5 text-sm text-sand-700">
                <input
                  type="checkbox"
                  checked={branches.includes(b)}
                  onChange={() => toggleBranch(b)}
                  className="h-4 w-4 rounded border-sand-400 text-combat-600 focus:ring-combat-500"
                />
                {b}
              </label>
            ))}
          </div>
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
