export const BRANCHES = ["A Branch", "Q Branch", "G Branch"] as const;
export type Branch = (typeof BRANCHES)[number];

export const BRANCH_SHORT: Record<Branch, string> = {
  "A Branch": "A",
  "Q Branch": "Q",
  "G Branch": "G",
};

export function parseBranches(branches: string): Branch[] {
  return branches
    .split(",")
    .map((b) => b.trim())
    .filter((b): b is Branch => BRANCHES.includes(b as Branch));
}

export function formatBranches(branches: string): string {
  return parseBranches(branches)
    .map((b) => BRANCH_SHORT[b])
    .join(", ");
}

export const CATEGORIES = ["Training", "Sports", "Administrative", "Other"] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRIORITIES = ["High", "Normal", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = ["Pending", "In Progress", "Completed"] as const;
export type Status = (typeof STATUSES)[number];

export const REMINDER_PREFERENCES = ["None", "Same Day", "1 Day Before", "2 Days Before"] as const;
export type ReminderPreference = (typeof REMINDER_PREFERENCES)[number];

export const WEEK_START_OPTIONS = ["Monday", "Sunday"] as const;
export type WeekStart = (typeof WEEK_START_OPTIONS)[number];

export type DisplayStatus = Status | "Overdue";

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; dot: string }> = {
  Training: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-500", dot: "bg-blue-500" },
  Sports: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-500", dot: "bg-emerald-500" },
  Administrative: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-500", dot: "bg-orange-500" },
  Other: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-500", dot: "bg-purple-500" },
};

export const STATUS_COLORS: Record<DisplayStatus, { bg: string; text: string }> = {
  Pending: { bg: "bg-slate-100", text: "text-slate-700" },
  "In Progress": { bg: "bg-amber-100", text: "text-amber-800" },
  Completed: { bg: "bg-combat-100", text: "text-combat-800" },
  Overdue: { bg: "bg-red-100", text: "text-red-700" },
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  High: { bg: "bg-red-100", text: "text-red-700" },
  Normal: { bg: "bg-sand-200", text: "text-sand-700" },
  Low: { bg: "bg-sand-100", text: "text-sand-500" },
};
