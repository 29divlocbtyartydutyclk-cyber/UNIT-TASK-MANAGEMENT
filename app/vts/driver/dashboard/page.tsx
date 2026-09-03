import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireVtsDriver } from "@/lib/vts/auth/server";
import { getActiveVtsVehiclesForPicker } from "@/lib/vts/data";
import { vtsLogout } from "@/app/actions/vts-auth";
import StartMovementForm from "./StartMovementForm";

export default async function VtsDriverDashboardPage() {
  const session = await requireVtsDriver();

  const existing = await prisma.vtsMovement.findFirst({
    where: { driverId: session.driverId, status: "ACTIVE" },
    select: { id: true },
  });
  if (existing) redirect("/vts/driver/active");

  const vehicles = await getActiveVtsVehiclesForPicker();

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-800 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold">VTS Driver</p>
          <p className="text-xs text-amber-100">
            {session.driverName} ({session.serviceId})
          </p>
        </div>
        <form action={vtsLogout}>
          <button type="submit" className="text-sm hover:underline">
            Sign out
          </button>
        </form>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <StartMovementForm vehicles={vehicles} />
      </main>
    </div>
  );
}
