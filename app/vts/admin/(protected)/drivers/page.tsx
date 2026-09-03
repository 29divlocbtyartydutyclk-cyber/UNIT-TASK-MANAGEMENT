import { prisma } from "@/lib/prisma";
import CreateDriverForm from "./CreateDriverForm";
import DriverRow from "./DriverRow";

export default async function VtsAdminDriversPage() {
  const drivers = await prisma.vtsDriver.findMany({
    orderBy: { name: "asc" },
    include: { movements: { where: { status: "ACTIVE" }, take: 1 } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-900">Drivers</h1>
      <CreateDriverForm />

      <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
        {drivers.length === 0 && <p className="p-4 text-sm text-parchment-500">No drivers registered yet.</p>}
        {drivers.map((d) => (
          <DriverRow
            key={d.id}
            driver={{ id: d.id, name: d.name, serviceId: d.serviceId, phone: d.phone, status: d.status }}
            activeVehicle={d.movements[0]?.baNumberSnapshot ?? null}
          />
        ))}
      </div>
    </div>
  );
}
