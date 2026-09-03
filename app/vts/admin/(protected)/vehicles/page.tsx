import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VTS_CATEGORIES, VTS_CATEGORY_LABELS } from "@/lib/vts/constants";
import { formatAgo } from "@/lib/vts/geo";
import CreateVehicleForm from "./CreateVehicleForm";
import VehicleRow from "./VehicleRow";

export default async function VtsAdminVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const vehicles = await prisma.vtsVehicle.findMany({
    where: {
      ...(category ? { category: category as never } : {}),
      ...(q
        ? {
            OR: [
              { baNumber: { contains: q } },
              { model: { contains: q } },
              { movements: { some: { status: "ACTIVE", driverNameSnapshot: { contains: q } } } },
              { movements: { some: { status: "ACTIVE", driverServiceIdSnapshot: { contains: q } } } },
            ],
          }
        : {}),
    },
    orderBy: { baNumber: "asc" },
    include: { movements: { where: { status: "ACTIVE" }, take: 1 } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-900">Vehicles</h1>
      <CreateVehicleForm />

      <form className="flex flex-wrap gap-2" action="/vts/admin/vehicles" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search BA number / model"
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
        <select name="category" defaultValue={category ?? ""} className="rounded border border-parchment-300 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {VTS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {VTS_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800">
          Filter
        </button>
        {(category || q) && (
          <Link href="/vts/admin/vehicles" className="text-sm text-parchment-600 self-center hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
        {vehicles.length === 0 && <p className="p-4 text-sm text-parchment-500">No vehicles found.</p>}
        {vehicles.map((v) => {
          const m = v.movements[0];
          return (
            <div key={v.id}>
              <VehicleRow
                vehicle={{
                  id: v.id,
                  baNumber: v.baNumber,
                  category: v.category,
                  model: v.model,
                  fuelType: v.fuelType,
                  mileageKmPerLiter: v.mileageKmPerLiter,
                  maxSpeedKmh: v.maxSpeedKmh,
                  status: v.status,
                }}
              />
              {m && (
                <p className="px-3 pb-3 text-xs text-parchment-500">
                  On movement: {m.driverNameSnapshot} ({m.driverServiceIdSnapshot}) · {m.distanceKm.toFixed(1)} km ·
                  last update {formatAgo(m.lastPingAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
