import type { DisplayStatus, Status } from "@/lib/constants";
import { isPast } from "@/lib/utils/date";

export function getDisplayStatus(task: { date: Date; endDate?: Date | null; status: string }): DisplayStatus {
  const status = task.status as Status;
  if (status === "Completed") return "Completed";
  const lastDay = task.endDate ?? task.date;
  if (isPast(lastDay)) return "Overdue";
  return status;
}
