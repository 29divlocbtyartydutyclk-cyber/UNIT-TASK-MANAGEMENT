"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireVtsDriver } from "@/lib/vts/auth/server";
import { vtsStartMovementSchema, vtsPingSchema } from "@/lib/vts/validation";
import { haversineMeters } from "@/lib/vts/geo";
import { VTS_DEFAULT_MILEAGE_KM_PER_LITER, VTS_MIN_DISTANCE_METERS, type VtsCategoryValue } from "@/lib/vts/constants";
import type { VtsActionResult } from "@/app/actions/vts-auth";

export async function startVtsMovement(input: unknown): Promise<VtsActionResult> {
  const session = await requireVtsDriver();
  const parsed = vtsStartMovementSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existingForDriver = await prisma.vtsMovement.findFirst({
    where: { driverId: session.driverId, status: "ACTIVE" },
  });
  if (existingForDriver) {
    return { success: false, error: "You already have an active movement in progress" };
  }

  const vehicle = await prisma.vtsVehicle.findUnique({ where: { id: parsed.data.vehicleId } });
  if (!vehicle || vehicle.status !== "ACTIVE") {
    return { success: false, error: "Vehicle not found or inactive" };
  }

  const conflict = await prisma.vtsMovement.findFirst({
    where: { vehicleId: vehicle.id, status: "ACTIVE" },
  });
  if (conflict) {
    return { success: false, error: "This vehicle is currently on an active movement." };
  }

  const categoryMileage = await prisma.vtsCategoryMileage.findUnique({ where: { category: vehicle.category } });
  const mileageUsedKmPerLiter =
    vehicle.mileageKmPerLiter ??
    categoryMileage?.mileageKmPerLiter ??
    VTS_DEFAULT_MILEAGE_KM_PER_LITER[vehicle.category as VtsCategoryValue];
  const maxSpeedKmh = vehicle.maxSpeedKmh ?? categoryMileage?.maxSpeedKmh ?? null;

  const movement = await prisma.vtsMovement.create({
    data: {
      driverId: session.driverId,
      driverNameSnapshot: session.driverName,
      driverServiceIdSnapshot: session.serviceId,
      vehicleId: vehicle.id,
      baNumberSnapshot: vehicle.baNumber,
      categorySnapshot: vehicle.category,
      destination: parsed.data.destination,
      purpose: parsed.data.purpose,
      startingOdometerKm: parsed.data.startingOdometerKm ?? undefined,
      passengers: parsed.data.passengers ?? undefined,
      expectedDurationMin: parsed.data.expectedDurationMin ?? undefined,
      remarks: parsed.data.remarks,
      mileageUsedKmPerLiter,
      maxSpeedKmh: maxSpeedKmh ?? undefined,
    },
  });

  await prisma.vtsAlert.create({
    data: {
      type: "MOVEMENT_STARTED",
      movementId: movement.id,
      baNumber: vehicle.baNumber,
      driverName: session.driverName,
      message: `${session.driverName} started a movement with ${vehicle.baNumber} to ${parsed.data.destination}`,
    },
  });

  revalidatePath("/vts/admin");
  redirect("/vts/driver/active");
}

export type VtsPingResult =
  | { success: true; distanceKm: number; estimatedOilLiters: number }
  | { success: false; error: string };

export async function pingVtsMovement(input: unknown): Promise<VtsPingResult> {
  const session = await requireVtsDriver();
  const parsed = vtsPingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const movement = await prisma.vtsMovement.findUnique({ where: { id: parsed.data.movementId } });
  if (!movement || movement.driverId !== session.driverId || movement.status !== "ACTIVE") {
    return { success: false, error: "Movement not found or not active" };
  }

  let distanceKm = movement.distanceKm;
  let shouldRecordPoint = true;

  if (movement.lastLat != null && movement.lastLng != null) {
    const deltaMeters = haversineMeters(
      { lat: movement.lastLat, lng: movement.lastLng },
      { lat: parsed.data.lat, lng: parsed.data.lng },
    );
    if (deltaMeters < VTS_MIN_DISTANCE_METERS) {
      shouldRecordPoint = false;
    } else {
      distanceKm += deltaMeters / 1000;
    }
  }

  const estimatedOilLiters = movement.mileageUsedKmPerLiter > 0 ? distanceKm / movement.mileageUsedKmPerLiter : 0;

  const previousSpeed = movement.lastSpeedKmh ?? 0;
  const newSpeed = parsed.data.speedKmh ?? 0;
  const crossedSpeedLimit =
    movement.maxSpeedKmh != null && previousSpeed <= movement.maxSpeedKmh && newSpeed > movement.maxSpeedKmh;

  await prisma.$transaction([
    prisma.vtsMovement.update({
      where: { id: movement.id },
      data: {
        distanceKm,
        estimatedOilLiters,
        lastLat: parsed.data.lat,
        lastLng: parsed.data.lng,
        lastAccuracy: parsed.data.accuracy ?? undefined,
        lastSpeedKmh: parsed.data.speedKmh ?? undefined,
        lastHeading: parsed.data.heading ?? undefined,
        lastPingAt: new Date(),
      },
    }),
    ...(shouldRecordPoint
      ? [
          prisma.vtsRoutePoint.create({
            data: {
              movementId: movement.id,
              lat: parsed.data.lat,
              lng: parsed.data.lng,
              accuracy: parsed.data.accuracy ?? undefined,
              speedKmh: parsed.data.speedKmh ?? undefined,
              heading: parsed.data.heading ?? undefined,
            },
          }),
        ]
      : []),
  ]);

  if (crossedSpeedLimit) {
    await prisma.vtsAlert.create({
      data: {
        type: "SPEED_EXCEEDED",
        movementId: movement.id,
        baNumber: movement.baNumberSnapshot,
        driverName: movement.driverNameSnapshot,
        message: `${movement.baNumberSnapshot} exceeded ${movement.maxSpeedKmh} km/h (at ${Math.round(newSpeed)} km/h)`,
      },
    });
  }

  return { success: true, distanceKm, estimatedOilLiters };
}

export async function endVtsMovement(movementId: string): Promise<VtsActionResult> {
  const session = await requireVtsDriver();

  const movement = await prisma.vtsMovement.findUnique({ where: { id: movementId } });
  if (!movement || movement.driverId !== session.driverId || movement.status !== "ACTIVE") {
    return { success: false, error: "Movement not found or not active" };
  }

  await prisma.vtsMovement.update({
    where: { id: movement.id },
    data: { status: "ENDED", endedAt: new Date() },
  });
  await prisma.vtsRoutePoint.deleteMany({ where: { movementId: movement.id } });
  await prisma.vtsAlert.create({
    data: {
      type: "MOVEMENT_ENDED",
      movementId: movement.id,
      baNumber: movement.baNumberSnapshot,
      driverName: movement.driverNameSnapshot,
      message: `${movement.driverNameSnapshot} ended the movement with ${movement.baNumberSnapshot}`,
    },
  });

  revalidatePath("/vts/admin");
  redirect(`/vts/driver/summary/${movement.id}`);
}
