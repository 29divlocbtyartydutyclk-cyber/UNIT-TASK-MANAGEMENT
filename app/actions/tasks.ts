"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validation";
import { STATUSES, type Status } from "@/lib/constants";

export type ActionResult = { success: true } | { success: false; error: string };

function revalidateTaskPaths() {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
}

export async function createTask(input: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }
  await prisma.task.create({ data: parsed.data });
  revalidateTaskPaths();
  return { success: true };
}

export async function updateTask(id: string, input: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }
  await prisma.task.update({ where: { id }, data: parsed.data });
  revalidateTaskPaths();
  return { success: true };
}

export async function updateTaskStatus(id: string, status: Status): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { success: false, error: "Invalid status" };
  }
  await prisma.task.update({ where: { id }, data: { status } });
  revalidateTaskPaths();
  return { success: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  await prisma.task.delete({ where: { id } });
  revalidateTaskPaths();
  return { success: true };
}
