import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireVtsDriver } from "@/lib/vts/auth/server";
import ActiveMovementClient from "./ActiveMovementClient";

export default async function VtsActiveMovementPage() {
  const session = await requireVtsDriver();

  const movement = await prisma.vtsMovement.findFirst({
    where: { driverId: session.driverId, status: "ACTIVE" },
  });
  if (!movement) redirect("/vts/driver/dashboard");

  return (
    <ActiveMovementClient
      movementId={movement.id}
      baNumber={movement.baNumberSnapshot}
      category={movement.categorySnapshot}
      driverName={movement.driverNameSnapshot}
      serviceId={movement.driverServiceIdSnapshot}
      destination={movement.destination}
      startedAt={movement.startedAt.toISOString()}
      initialDistanceKm={movement.distanceKm}
      initialEstimatedOilLiters={movement.estimatedOilLiters}
    />
  );
}
