import { prisma } from "@/lib/prisma";
import DriverLoginForm from "./DriverLoginForm";

export default async function VtsDriverLoginPage() {
  const drivers = await prisma.vtsDriver.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, serviceId: true },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-amber-900 mb-1">Driver Login</h1>
        <p className="text-sm text-parchment-600 mb-6">Select your name and enter the driver password.</p>
        <DriverLoginForm drivers={drivers} />
      </div>
    </main>
  );
}
