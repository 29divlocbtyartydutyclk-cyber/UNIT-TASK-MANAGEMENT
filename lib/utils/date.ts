import { startOfDay, isSameDay, addDays, format, parse as parseDate } from "date-fns";

export function today(): Date {
  return startOfDay(new Date());
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isPast(date: Date): boolean {
  return startOfDay(date) < today();
}

export function nextNDays(n: number): { start: Date; end: Date } {
  const start = today();
  const end = addDays(start, n);
  return { start, end };
}

export function formatDayHeading(date: Date): string {
  return format(date, "d MMMM").toUpperCase();
}

export function formatShortDate(date: Date): string {
  return format(date, "d MMM yyyy");
}

export function formatHeaderDate(date: Date): string {
  return format(date, "EEEE, d MMMM yyyy");
}

export function formatDateRange(date: Date, endDate: Date | null): string {
  if (!endDate || isSameDay(date, endDate)) return formatShortDate(date);
  return `${formatShortDate(date)} - ${formatShortDate(endDate)}`;
}

/** A task is "active" on a given day if that day falls within [date, endDate ?? date]. */
export function isTaskActiveOn(task: { date: Date; endDate: Date | null }, day: Date): boolean {
  const start = startOfDay(task.date);
  const end = startOfDay(task.endDate ?? task.date);
  const d = startOfDay(day);
  return d >= start && d <= end;
}

export function isTaskActiveToday(task: { date: Date; endDate: Date | null }): boolean {
  return isTaskActiveOn(task, new Date());
}

/** Parse a DD/MM/YYYY string into a local Date at midnight. */
export function parseDDMMYYYY(value: string): Date {
  return parseDate(value, "dd/MM/yyyy", new Date());
}

export function formatDDMMYYYY(date: Date): string {
  return format(date, "dd/MM/yyyy");
}
