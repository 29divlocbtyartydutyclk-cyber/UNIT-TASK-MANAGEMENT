import type { DisplayStatus, Status } from "@/lib/constants";
import { isPast } from "@/lib/utils/date";

export function getDisplayStatus(task: { date: Date; status: string }): DisplayStatus {
  const status = task.status as Status;
  if (status === "Completed") return "Completed";
  if (isPast(task.date)) return "Overdue";
  return status;
}
