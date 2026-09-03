import { getVtsFleetState, getVtsRoutePolylines } from "@/lib/vts/data";
import LiveMapClient from "./LiveMapClient";

export default async function VtsAdminMapPage() {
  const vehicles = await getVtsFleetState();
  const activeMovementIds = vehicles.filter((v) => v.activeMovement).map((v) => v.activeMovement!.id);
  const routes = await getVtsRoutePolylines(activeMovementIds);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-amber-900">Live Map</h1>
      <LiveMapClient initialVehicles={vehicles} initialRoutes={routes} />
    </div>
  );
}
