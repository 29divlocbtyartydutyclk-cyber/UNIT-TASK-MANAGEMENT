"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setVtsSessionCookie, clearVtsSessionCookie, requireVtsAdmin } from "@/lib/vts/auth/server";
import {
  vtsDriverLoginSchema,
  vtsAdminLoginSchema,
  vtsChangeAdminPasswordSchema,
  vtsChangeDriverPasswordSchema,
} from "@/lib/vts/validation";

export type VtsActionResult = { success: true } | { success: false; error: string };

export async function vtsDriverLogin(input: unknown): Promise<VtsActionResult> {
  const parsed = vtsDriverLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const settings = await prisma.vtsSettings.findUnique({ where: { id: 1 } });
  if (!settings) return { success: false, error: "System is not set up yet" };

  const valid = await bcrypt.compare(parsed.data.password, settings.driverPasswordHash);
  if (!valid) return { success: false, error: "Incorrect password" };

  const driver = await prisma.vtsDriver.findUnique({ where: { id: parsed.data.driverId } });
  if (!driver || driver.status !== "ACTIVE") {
    return { success: false, error: "Driver not found or disabled" };
  }

  await setVtsSessionCookie({
    role: "DRIVER",
    driverId: driver.id,
    driverName: driver.name,
    serviceId: driver.serviceId,
  });

  redirect("/vts/driver/dashboard");
}

export async function vtsAdminLogin(input: unknown): Promise<VtsActionResult> {
  const parsed = vtsAdminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  if (parsed.data.username !== "ADMIN") {
    return { success: false, error: "Incorrect username or password" };
  }

  const settings = await prisma.vtsSettings.findUnique({ where: { id: 1 } });
  if (!settings) return { success: false, error: "System is not set up yet" };

  const valid = await bcrypt.compare(parsed.data.password, settings.adminPasswordHash);
  if (!valid) return { success: false, error: "Incorrect username or password" };

  await setVtsSessionCookie({ role: "ADMIN" });
  redirect("/vts/admin");
}

export async function vtsLogout() {
  await clearVtsSessionCookie();
  redirect("/vts");
}

export async function changeVtsAdminPassword(input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsChangeAdminPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const settings = await prisma.vtsSettings.findUnique({ where: { id: 1 } });
  if (!settings) return { success: false, error: "System is not set up yet" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, settings.adminPasswordHash);
  if (!valid) return { success: false, error: "Current password is incorrect" };

  const adminPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.vtsSettings.update({ where: { id: 1 }, data: { adminPasswordHash } });
  return { success: true };
}

export async function changeVtsDriverPassword(input: unknown): Promise<VtsActionResult> {
  await requireVtsAdmin();
  const parsed = vtsChangeDriverPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const driverPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.vtsSettings.update({ where: { id: 1 }, data: { driverPasswordHash } });
  return { success: true };
}
