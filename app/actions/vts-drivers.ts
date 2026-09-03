"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireVtsAdmin } from "@/lib/vts/auth/server";
import { vtsDriverInputSchema } from "@/lib/vts/validation";
import type { VtsActionResult } from "@/app/actions/vts-auth";

export async function createVtsDriver(input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsDriverInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.vtsDriver.create({ data: parsed.data });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") return { success: false, error: "A driver with this Service ID already exists" };
    throw err;
  }

  revalidatePath("/vts/admin/drivers");
  return { success: true };
}

export async function updateVtsDriver(driverId: string, input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsDriverInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.vtsDriver.update({ where: { id: driverId }, data: parsed.data });
  revalidatePath("/vts/admin/drivers");
  return { success: true };
}

export async function setVtsDriverStatus(driverId: string, status: "ACTIVE" | "DISABLED"): Promise<void> {
  await requireVtsAdmin();
  await prisma.vtsDriver.update({ where: { id: driverId }, data: { status } });
  revalidatePath("/vts/admin/drivers");
}
