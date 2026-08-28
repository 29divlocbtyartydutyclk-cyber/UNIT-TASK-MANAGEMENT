"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validation";
import { STATUSES, type Status } from "@/lib/constants";
import { getSessionRole } from "@/lib/auth/server";
import { canEdit } from "@/lib/auth/session";

export type ActionResult = { success: true } | { success: false; error: string };

function revalidateTaskPaths() {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
}

async function requireEditPermission(): Promise<ActionResult | null> {
  const role = await getSessionRole();
  if (!canEdit(role)) {
    return { success: false, error: "You do not have permission to do this" };
  }
  return null;
}

export async function createTask(input: unknown): Promise<ActionResult> {
  const permissionError = await requireEditPermission();
  if (permissionError) return permissionError;

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }
  await prisma.task.create({ data: parsed.data });
  revalidateTaskPaths();
  return { success: true };
}

export async function updateTask(id: string, input: unknown): Promise<ActionResult> {
  const permissionError = await requireEditPermission();
  if (permissionError) return permissionError;

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }
  await prisma.task.update({ where: { id }, data: parsed.data });
  revalidateTaskPaths();
  return { success: true };
}

export async function updateTaskStatus(id: string, status: Status): Promise<ActionResult> {
  const permissionError = await requireEditPermission();
  if (permissionError) return permissionError;

  if (!STATUSES.includes(status)) {
    return { success: false, error: "Invalid status" };
  }
  await prisma.task.update({ where: { id }, data: { status } });
  revalidateTaskPaths();
  return { success: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const permissionError = await requireEditPermission();
  if (permissionError) return permissionError;

  await prisma.task.delete({ where: { id } });
  revalidateTaskPaths();
  return { success: true };
}
