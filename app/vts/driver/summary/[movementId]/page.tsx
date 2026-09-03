import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireVtsDriver } from "@/lib/vts/auth/server";
import { VTS_CATEGORY_LABELS, type VtsCategoryValue } from "@/lib/vts/constants";

export default async function VtsMovementSummaryPage({ params }: { params: Promise<{ movementId: string }> }) {
  const { movementId } = await params;
  const session = await requireVtsDriver();

  const movement = await prisma.vtsMovement.findUnique({ where: { id: movementId } });
  if (!movement || movement.driverId !== session.driverId) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-amber-700">Movement Summary</p>
          <h1 className="text-2xl font-bold text-amber-900">{movement.baNumberSnapshot}</h1>
          <p className="text-sm text-parchment-600">{VTS_CATEGORY_LABELS[movement.categorySnapshot as VtsCategoryValue]}</p>
        </div>

        <dl className="text-sm space-y-2">
          <Row label="Driver" value={movement.driverNameSnapshot} />
          <Row label="Service ID" value={movement.driverServiceIdSnapshot} />
          <Row label="Destination" value={movement.destination} />
          <Row label="Purpose" value={movement.purpose} />
          <Row
            label="Start Time"
            value={movement.startedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          />
          <Row
            label="End Time"
            value={movement.endedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "-"}
          />
          <Row label="Distance Travelled" value={`${movement.distanceKm.toFixed(1)} km`} />
          <Row label="Mileage" value={`${movement.mileageUsedKmPerLiter} km/L`} />
          <Row label="Estimated Oil Consumed" value={`${movement.estimatedOilLiters.toFixed(1)} L`} />
        </dl>

        <Link
          href="/vts/driver/dashboard"
          className="block text-center w-full rounded bg-amber-700 text-white py-2.5 font-medium hover:bg-amber-800"
        >
          Start Another Movement
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-parchment-500">{label}</dt>
      <dd className="font-medium text-parchment-800">{value}</dd>
    </div>
  );
}
