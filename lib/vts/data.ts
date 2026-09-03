import "server-only";
import { prisma } from "@/lib/prisma";
import { computeMovementStatus } from "@/lib/vts/geo";
import type { VtsComputedStatus } from "@/lib/vts/constants";

export type VtsFleetVehicle = {
  id: string;
  baNumber: string;
  category: string;
  model: string | null;
  fuelType: string | null;
  mileageKmPerLiter: number | null;
  maxSpeedKmh: number | null;
  vehicleStatus: string;
  computedStatus: VtsComputedStatus;
  activeMovement: {
    id: string;
    driverName: string;
    serviceId: string;
    driverPhone: string | null;
    destination: string;
    purpose: string;
    startedAt: Date;
    distanceKm: number;
    estimatedOilLiters: number;
    mileageUsedKmPerLiter: number;
    maxSpeedKmh: number | null;
    lastLat: number | null;
    lastLng: number | null;
    lastAccuracy: number | null;
    lastSpeedKmh: number | null;
    lastHeading: number | null;
    lastPingAt: Date | null;
  } | null;
};

export async function getVtsFleetState(): Promise<VtsFleetVehicle[]> {
  const vehicles = await prisma.vtsVehicle.findMany({
    orderBy: { baNumber: "asc" },
    include: {
      movements: {
        where: { status: "ACTIVE" },
        take: 1,
        orderBy: { startedAt: "desc" },
        include: { driver: { select: { phone: true } } },
      },
    },
  });

  return vehicles.map((v) => {
    const movement = v.movements[0] ?? null;
    const computedStatus: VtsComputedStatus =
      v.status !== "ACTIVE" ? "STATIC" : movement ? computeMovementStatus(movement) : "STATIC";

    return {
      id: v.id,
      baNumber: v.baNumber,
      category: v.category,
      model: v.model,
      fuelType: v.fuelType,
      mileageKmPerLiter: v.mileageKmPerLiter,
      maxSpeedKmh: v.maxSpeedKmh,
      vehicleStatus: v.status,
      computedStatus,
      activeMovement: movement
        ? {
            id: movement.id,
            driverName: movement.driverNameSnapshot,
            serviceId: movement.driverServiceIdSnapshot,
            driverPhone: movement.driver.phone,
            destination: movement.destination,
            purpose: movement.purpose,
            startedAt: movement.startedAt,
            distanceKm: movement.distanceKm,
            estimatedOilLiters: movement.estimatedOilLiters,
            mileageUsedKmPerLiter: movement.mileageUsedKmPerLiter,
            maxSpeedKmh: movement.maxSpeedKmh,
            lastLat: movement.lastLat,
            lastLng: movement.lastLng,
            lastAccuracy: movement.lastAccuracy,
            lastSpeedKmh: movement.lastSpeedKmh,
            lastHeading: movement.lastHeading,
            lastPingAt: movement.lastPingAt,
          }
        : null,
    };
  });
}

export async function getActiveVtsVehiclesForPicker() {
  const vehicles = await prisma.vtsVehicle.findMany({
    where: { status: "ACTIVE" },
    orderBy: { baNumber: "asc" },
    include: { movements: { where: { status: "ACTIVE" }, take: 1 } },
  });
  return vehicles.map((v) => ({
    id: v.id,
    baNumber: v.baNumber,
    category: v.category,
    busy: v.movements.length > 0,
  }));
}

export async function getVtsRoutePolylines(movementIds: string[]) {
  if (movementIds.length === 0) return {};
  const points = await prisma.vtsRoutePoint.findMany({
    where: { movementId: { in: movementIds } },
    orderBy: { recordedAt: "asc" },
    select: { movementId: true, lat: true, lng: true },
  });
  const byMovement: Record<string, [number, number][]> = {};
  for (const p of points) {
    if (!byMovement[p.movementId]) byMovement[p.movementId] = [];
    byMovement[p.movementId].push([p.lat, p.lng]);
  }
  return byMovement;
}

export async function getVtsAlerts(limit = 50) {
  return prisma.vtsAlert.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}
