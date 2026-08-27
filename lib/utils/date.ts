import { startOfDay, isSameDay, addDays, format } from "date-fns";

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
