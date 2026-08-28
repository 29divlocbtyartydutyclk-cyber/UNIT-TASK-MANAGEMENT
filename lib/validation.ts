import { z } from "zod";
import { BRANCHES, CATEGORIES, PRIORITIES, REMINDER_PREFERENCES, WEEK_START_OPTIONS } from "@/lib/constants";
import { parseDDMMYYYY } from "@/lib/utils/date";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

const dateField = z
  .string()
  .regex(DATE_PATTERN, "Date is required (DD/MM/YYYY)")
  .transform((val) => parseDDMMYYYY(val))
  .refine((date) => !isNaN(date.getTime()), { message: "Enter a valid date (DD/MM/YYYY)" });

const endDateField = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((v) => v === "" || DATE_PATTERN.test(v), { message: "End date must be DD/MM/YYYY" })
  .transform((v) => (v === "" ? null : parseDDMMYYYY(v)))
  .refine((date) => date === null || !isNaN(date.getTime()), { message: "Enter a valid end date (DD/MM/YYYY)" });

export const taskSchema = z
  .object({
    title: z.string().trim().min(1, "Task name is required"),
    date: dateField,
    endDate: endDateField,
    time: optionalText,
    branches: z.array(z.enum(BRANCHES)).min(1, "Select at least one branch").transform((arr) => arr.join(",")),
    category: z.enum(CATEGORIES, { message: "Category is required" }),
    responsiblePerson: optionalText,
    priority: z.enum(PRIORITIES).default("Normal"),
    remarks: optionalText,
  })
  .refine((data) => !data.endDate || data.endDate >= data.date, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type TaskInput = z.infer<typeof taskSchema>;

export const settingsSchema = z.object({
  unitName: z.string().trim().min(1, "Unit name is required"),
  defaultReminder: z.enum(REMINDER_PREFERENCES),
  weekStartsOn: z.enum(WEEK_START_OPTIONS),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
