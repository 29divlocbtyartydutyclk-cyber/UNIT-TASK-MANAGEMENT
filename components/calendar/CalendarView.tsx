"use client";

import { useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { Task } from "@prisma/client";
import { CATEGORY_COLORS, type Category } from "@/lib/constants";
import { formatDDMMYYYY } from "@/lib/utils/date";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { useCanEdit } from "@/components/auth/RoleProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/icons";

const MONDAY_FIRST_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SUNDAY_FIRST_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseMonthParam(param: string): Date {
  const [year, month] = param.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function CalendarView({
  tasks,
  monthParam,
  weekStartsOn = 1,
}: {
  tasks: Task[];
  monthParam: string;
  weekStartsOn?: 0 | 1;
}) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createDate, setCreateDate] = useState<string | null>(null);
  const canEdit = useCanEdit();

  const today = new Date();
  const monthStart = startOfMonth(parseMonthParam(monthParam));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const isCurrentMonth = isSameMonth(monthStart, today);

  const tasksByDay = new Map<string, Task[]>();
  for (const t of tasks) {
    const range = eachDayOfInterval({ start: t.date, end: t.endDate ?? t.date });
    for (const d of range) {
      const key = d.toDateString();
      if (!tasksByDay.has(key)) tasksByDay.set(key, []);
      tasksByDay.get(key)!.push(t);
    }
  }

  const prevMonthParam = format(subMonths(monthStart, 1), "yyyy-MM");
  const nextMonthParam = format(addMonths(monthStart, 1), "yyyy-MM");
  const currentMonthParam = format(today, "yyyy-MM");
  const weekdayLabels = weekStartsOn === 0 ? SUNDAY_FIRST_LABELS : MONDAY_FIRST_LABELS;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${prevMonthParam}`}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-sand-700 transition-colors hover:border-combat-500 hover:bg-combat-50 hover:text-combat-700"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
          <div className="flex min-w-[220px] flex-col items-center px-1">
            <h2 className="text-xl font-extrabold tracking-tight text-combat-800">{format(monthStart, "MMMM yyyy")}</h2>
            {isCurrentMonth ? (
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-combat-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Current Month
              </span>
            ) : (
              <Link
                href={`/calendar?month=${currentMonthParam}`}
                className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-combat-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-combat-700 hover:bg-combat-50"
              >
                Jump to Today
              </Link>
            )}
          </div>
          <Link
            href={`/calendar?month=${nextMonthParam}`}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-sand-700 transition-colors hover:border-combat-500 hover:bg-combat-50 hover:text-combat-700"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <AddTaskButton />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-sand-200 shadow-md">
        <div className="grid grid-cols-7 gap-px bg-sand-200 text-xs">
          {weekdayLabels.map((d) => (
            <div key={d} className="bg-combat-700 px-1 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-sand-50 sm:px-2">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const key = day.toDateString();
            const dayTasks = tasksByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={key}
                onClick={canEdit ? () => setCreateDate(formatDDMMYYYY(day)) : undefined}
                className={`relative min-h-[92px] p-1.5 align-top transition-colors sm:min-h-[112px] ${
                  isToday ? "bg-combat-200 ring-2 ring-inset ring-combat-600" : "bg-combat-50"
                } ${canEdit ? "cursor-pointer hover:bg-combat-100" : ""}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  {isToday && (
                    <span className="hidden rounded bg-combat-600 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:inline-block">
                      Today
                    </span>
                  )}
                  <span
                    className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday
                        ? "bg-combat-600 text-white shadow-sm"
                        : inMonth
                          ? "text-combat-800"
                          : "text-combat-400"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dayTasks.map((task) => {
                    const c = CATEGORY_COLORS[task.category as Category];
                    return (
                      <button
                        type="button"
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                        className={`block w-full truncate rounded border-l-2 ${c.border} ${c.bg} ${c.text} px-1 py-0.5 text-left text-[10px] font-medium uppercase shadow-sm transition-transform hover:scale-[1.03] hover:shadow`}
                      >
                        {task.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTask && <TaskDetailDialog task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {createDate && (
        <TaskFormDialog open onClose={() => setCreateDate(null)} title="Add Task">
          <TaskForm mode="create" defaultDate={createDate} onSuccess={() => setCreateDate(null)} />
        </TaskFormDialog>
      )}
    </div>
  );
}
