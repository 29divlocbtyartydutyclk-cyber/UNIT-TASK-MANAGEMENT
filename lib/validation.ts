import { z } from "zod";
import { parse as parseDate } from "date-fns";
import { BRANCHES, CATEGORIES, PRIORITIES, REMINDER_PREFERENCES, WEEK_START_OPTIONS } from "@/lib/constants";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task name is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required")
    .transform((val) => parseDate(val, "yyyy-MM-dd", new Date())),
  time: optionalText,
  branch: z.enum(BRANCHES, { message: "Branch is required" }),
  category: z.enum(CATEGORIES, { message: "Category is required" }),
  responsiblePerson: optionalText,
  priority: z.enum(PRIORITIES).default("Normal"),
  remarks: optionalText,
});

export type TaskInput = z.infer<typeof taskSchema>;

export const settingsSchema = z.object({
  unitName: z.string().trim().min(1, "Unit name is required"),
  defaultReminder: z.enum(REMINDER_PREFERENCES),
  weekStartsOn: z.enum(WEEK_START_OPTIONS),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
