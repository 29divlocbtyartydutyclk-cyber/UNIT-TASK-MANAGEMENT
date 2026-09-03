import Link from "next/link";
import { notFound } from "next/navigation";
import { getVtsFleetState } from "@/lib/vts/data";
import {
  VTS_CATEGORIES,
  VTS_CATEGORY_LABELS,
  VTS_STATUS_COLORS,
  type VtsCategoryValue,
  type VtsComputedStatus,
} from "@/lib/vts/constants";
import { formatAgo, gpsAccuracyLabel } from "@/lib/vts/geo";
import type { VtsFleetVehicle } from "@/lib/vts/data";

const VALID_STATUSES: VtsComputedStatus[] = ["ON_MOVE", "STOPPED", "STATIC", "WEAK_SIGNAL", "OFFLINE"];

export default async function VtsDashboardDetailPage({
  params,
}: {
  params: Promise<{ type: string; value: string }>;
}) {
  const { type, value } = await params;

  if (type !== "all" && type !== "status" && type !== "category") notFound();
  if (type === "status" && !VALID_STATUSES.includes(value as VtsComputedStatus)) notFound();
  if (type === "category" && !VTS_CATEGORIES.includes(value as VtsCategoryValue)) notFound();

  const vehicles = await getVtsFleetState();
  const filtered =
    type === "all"
      ? vehicles
      : type === "status"
        ? vehicles.filter((v) => v.computedStatus === value)
        : vehicles.filter((v) => v.category === value);

  const title =
    type === "all" ? "All Vehicles" : type === "status" ? value.replace("_", " ") : VTS_CATEGORY_LABELS[value as VtsCategoryValue];

  return (
    <div className="space-y-4">
      <div>
        <Link href="/vts/admin" className="text-sm text-amber-700 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-amber-900 mt-1">{title}</h1>
        <p className="text-sm text-parchment-600">{filtered.length} vehicle(s)</p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-parchment-500">No vehicles match this filter.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((v) => (
            <VehicleDetailCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleDetailCard({ vehicle }: { vehicle: VtsFleetVehicle }) {
  const m = vehicle.activeMovement;
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-amber-900">{vehicle.baNumber}</p>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${VTS_STATUS_COLORS[vehicle.computedStatus].bg} ${VTS_STATUS_COLORS[vehicle.computedStatus].text}`}
        >
          {vehicle.computedStatus.replace("_", " ")}
        </span>
      </div>
      <p className="text-parchment-600">{VTS_CATEGORY_LABELS[vehicle.category as VtsCategoryValue]}</p>
      <Row label="Model" value={vehicle.model ?? "-"} />
      <Row label="Fuel Type" value={vehicle.fuelType ?? "-"} />
      <Row
        label="Mileage"
        value={vehicle.mileageKmPerLiter != null ? `${vehicle.mileageKmPerLiter} km/L (override)` : "Category default"}
      />
      <Row label="Max Speed" value={vehicle.maxSpeedKmh != null ? `${vehicle.maxSpeedKmh} km/h` : "-"} />

      {m ? (
        <div className="pt-2 mt-2 border-t border-parchment-100 space-y-2">
          <Row label="Driver" value={`${m.driverName} (${m.serviceId})`} />
          <div className="flex justify-between">
            <span className="text-parchment-500">Phone</span>
            {m.driverPhone ? (
              <a href={`tel:${m.driverPhone}`} className="font-medium text-amber-700 hover:underline">
                {m.driverPhone}
              </a>
            ) : (
              <span className="font-medium text-parchment-800">-</span>
            )}
          </div>
          <Row label="Speed" value={m.lastSpeedKmh != null ? `${Math.round(m.lastSpeedKmh)} km/h` : "-"} />
          <Row label="Distance" value={`${m.distanceKm.toFixed(1)} km`} />
          <Row label="Estimated Oil" value={`${m.estimatedOilLiters.toFixed(1)} L`} />
          <Row
            label="GPS Accuracy"
            value={m.lastAccuracy != null ? `${Math.round(m.lastAccuracy)} m (${gpsAccuracyLabel(m.lastAccuracy).label})` : "-"}
          />
          <Row label="Last Update" value={formatAgo(m.lastPingAt)} />
          <Row label="Destination" value={m.destination} />
          <Row label="Purpose" value={m.purpose} />
          <Row label="Start Time" value={new Date(m.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
        </div>
      ) : (
        <p className="pt-2 mt-2 border-t border-parchment-100 text-parchment-500">Not currently on a movement.</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-parchment-500">{label}</span>
      <span className="font-medium text-parchment-800">{value}</span>
    </div>
  );
}
