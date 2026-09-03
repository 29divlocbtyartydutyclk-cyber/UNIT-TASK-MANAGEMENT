"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireVtsAdmin } from "@/lib/vts/auth/server";
import { vtsCategoryMileageInputSchema } from "@/lib/vts/validation";
import type { VtsActionResult } from "@/app/actions/vts-auth";

export async function upsertVtsCategoryMileage(input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsCategoryMileageInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.vtsCategoryMileage.upsert({
    where: { category: parsed.data.category },
    update: { mileageKmPerLiter: parsed.data.mileageKmPerLiter, maxSpeedKmh: parsed.data.maxSpeedKmh },
    create: parsed.data,
  });

  revalidatePath("/vts/admin/mileage");
  return { success: true };
}
