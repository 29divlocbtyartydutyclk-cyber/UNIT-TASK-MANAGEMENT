"use client";

import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/icons";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseValue(value: string): Date | null {
  if (!value) return null;
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return isValid(parsed) ? parsed : null;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  allowClear = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected ?? new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function togglePicker() {
    if (!open) setViewMonth(startOfMonth(selected ?? new Date()));
    setOpen((o) => !o);
  }

  function selectDay(day: Date) {
    onChange(format(day, "dd/MM/yyyy"));
    setOpen(false);
  }

  const monthStart = viewMonth;
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={togglePicker}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-sand-300 px-3 py-2 text-left text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500"
      >
        <span className={value ? "text-sand-900" : "text-sand-400"}>{value || placeholder}</span>
        <CalendarIcon className="h-4 w-4 text-sand-500" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-64 rounded-lg border border-sand-200 bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-sand-600 hover:bg-sand-100"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-combat-800">{format(monthStart, "MMMM yyyy")}</span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-sand-600 hover:bg-sand-100"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase text-sand-500">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const inMonth = isSameMonth(day, monthStart);
              const isSelected = selected !== null && isSameDay(day, selected);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  onClick={() => selectDay(day)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    isSelected
                      ? "bg-combat-600 font-semibold text-white"
                      : isToday
                        ? "bg-combat-100 font-semibold text-combat-800"
                        : inMonth
                          ? "text-sand-800 hover:bg-sand-100"
                          : "text-sand-300 hover:bg-sand-50"
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-sand-100 pt-2">
            <button
              type="button"
              onClick={() => selectDay(new Date())}
              className="text-xs font-medium text-combat-700 hover:underline"
            >
              Today
            </button>
            {allowClear && value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
