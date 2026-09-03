"use server";

import { requireVtsAdmin } from "@/lib/vts/auth/server";
import { getVtsFleetState, getVtsRoutePolylines, getVtsAlerts } from "@/lib/vts/data";

export async function getVtsLiveState() {
  await requireVtsAdmin();
  const vehicles = await getVtsFleetState();
  const activeMovementIds = vehicles.filter((v) => v.activeMovement).map((v) => v.activeMovement!.id);
  const routes = await getVtsRoutePolylines(activeMovementIds);
  return { vehicles, routes };
}

export async function getVtsRecentAlerts(limit = 50) {
  await requireVtsAdmin();
  return getVtsAlerts(limit);
}
