"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validation";
import { getSessionRole } from "@/lib/auth/server";
import { isAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/app/actions/tasks";

export async function updateSettings(input: unknown): Promise<ActionResult> {
  const role = await getSessionRole();
  if (!isAdmin(role)) {
    return { success: false, error: "Only Admin can change settings" };
  }

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid settings" };
  }
  await prisma.settings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  revalidatePath("/settings");
  revalidatePath("/calendar");
  return { success: true };
}
