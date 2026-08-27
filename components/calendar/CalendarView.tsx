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
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskDetailDialog } from "@/components/calendar/TaskDetailDialog";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseMonthParam(param: string): Date {
  const [year, month] = param.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function CalendarView({ tasks, monthParam }: { tasks: Task[]; monthParam: string }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createDate, setCreateDate] = useState<string | null>(null);

  const monthStart = startOfMonth(parseMonthParam(monthParam));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const tasksByDay = new Map<string, Task[]>();
  for (const t of tasks) {
    const key = t.date.toDateString();
    if (!tasksByDay.has(key)) tasksByDay.set(key, []);
    tasksByDay.get(key)!.push(t);
  }

  const prevMonthParam = format(subMonths(monthStart, 1), "yyyy-MM");
  const nextMonthParam = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/calendar?month=${prevMonthParam}`}
            className="rounded-md border border-sand-300 px-3 py-1.5 text-sm font-medium text-sand-700 hover:bg-sand-100"
          >
            ‹ Prev
          </Link>
          <h2 className="w-40 text-center text-lg font-semibold text-combat-800">{format(monthStart, "MMMM yyyy")}</h2>
          <Link
            href={`/calendar?month=${nextMonthParam}`}
            className="rounded-md border border-sand-300 px-3 py-1.5 text-sm font-medium text-sand-700 hover:bg-sand-100"
          >
            Next ›
          </Link>
        </div>
        <AddTaskButton />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-sand-200 bg-sand-200 text-xs">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="bg-sand-100 px-1 py-1.5 text-center font-semibold text-sand-600 sm:px-2">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = day.toDateString();
          const dayTasks = tasksByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={key}
              onClick={() => setCreateDate(format(day, "yyyy-MM-dd"))}
              className={`min-h-[92px] cursor-pointer bg-white p-1.5 align-top hover:bg-sand-50 sm:min-h-[110px] ${
                inMonth ? "" : "opacity-40"
              }`}
            >
              <div className="mb-1 flex justify-end">
                <span
                  className={
                    isToday
                      ? "flex h-5 w-5 items-center justify-center rounded-full bg-combat-600 text-[11px] font-semibold text-white"
                      : "text-xs font-medium text-sand-600"
                  }
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
                      className={`block w-full truncate rounded border-l-2 ${c.border} ${c.bg} ${c.text} px-1 py-0.5 text-left text-[10px] font-medium`}
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

      {selectedTask && <TaskDetailDialog task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {createDate && (
        <TaskFormDialog open onClose={() => setCreateDate(null)} title="Add Task">
          <TaskForm mode="create" defaultDate={createDate} onSuccess={() => setCreateDate(null)} />
        </TaskFormDialog>
      )}
    </div>
  );
}
