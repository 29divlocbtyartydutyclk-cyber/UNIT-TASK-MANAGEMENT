"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireVtsAdmin } from "@/lib/vts/auth/server";
import { vtsVehicleInputSchema } from "@/lib/vts/validation";
import type { VtsActionResult } from "@/app/actions/vts-auth";

export async function createVtsVehicle(input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsVehicleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.vtsVehicle.create({ data: parsed.data });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") return { success: false, error: "A vehicle with this BA number already exists" };
    throw err;
  }

  revalidatePath("/vts/admin/vehicles");
  return { success: true };
}

export async function updateVtsVehicle(vehicleId: string, input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsVehicleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.vtsVehicle.update({ where: { id: vehicleId }, data: parsed.data });
  revalidatePath("/vts/admin/vehicles");
  return { success: true };
}

export async function setVtsVehicleStatus(vehicleId: string, status: "ACTIVE" | "DISABLED"): Promise<void> {
  await requireVtsAdmin();
  await prisma.vtsVehicle.update({ where: { id: vehicleId }, data: { status } });
  revalidatePath("/vts/admin/vehicles");
}
