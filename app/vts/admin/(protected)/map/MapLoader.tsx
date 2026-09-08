"use client";

import dynamic from "next/dynamic";
import type { VtsFleetVehicle } from "@/lib/vts/data";

const LiveMapClient = dynamic(() => import("./LiveMapClient"), { ssr: false });

export default function MapLoader({
  initialVehicles,
  initialRoutes,
}: {
  initialVehicles: VtsFleetVehicle[];
  initialRoutes: Record<string, [number, number][]>;
}) {
  return <LiveMapClient initialVehicles={initialVehicles} initialRoutes={initialRoutes} />;
}
