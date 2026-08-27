import type { Task } from "@prisma/client";
import { getDisplayStatus } from "@/lib/utils/task-status";
import { BRANCHES, CATEGORIES, STATUSES, type Branch, type Category, type DisplayStatus } from "@/lib/constants";

export interface TaskFilterValues {
  branch: Branch | "All";
  category: Category | "All";
  status: DisplayStatus | "All";
  search: string;
}

const DISPLAY_STATUSES: DisplayStatus[] = [...STATUSES, "Overdue"];

export function parseTaskFilters(params: {
  branch?: string;
  category?: string;
  status?: string;
  search?: string;
}): TaskFilterValues {
  return {
    branch: BRANCHES.includes(params.branch as Branch) ? (params.branch as Branch) : "All",
    category: CATEGORIES.includes(params.category as Category) ? (params.category as Category) : "All",
    status: DISPLAY_STATUSES.includes(params.status as DisplayStatus) ? (params.status as DisplayStatus) : "All",
    search: params.search ?? "",
  };
}

export function filterTasks(tasks: Task[], filters: TaskFilterValues): Task[] {
  const search = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.branch !== "All" && task.branch !== filters.branch) return false;
    if (filters.category !== "All" && task.category !== filters.category) return false;
    if (filters.status !== "All" && getDisplayStatus(task) !== filters.status) return false;
    if (search) {
      const matchesTitle = task.title.toLowerCase().includes(search);
      const matchesResponsible = (task.responsiblePerson ?? "").toLowerCase().includes(search);
      if (!matchesTitle && !matchesResponsible) return false;
    }
    return true;
  });
}
