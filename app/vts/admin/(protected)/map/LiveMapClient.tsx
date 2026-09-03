"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getVtsLiveState } from "@/app/actions/vts-live";
import { formatAgo, gpsAccuracyLabel } from "@/lib/vts/geo";
import { VTS_CATEGORY_LABELS, type VtsCategoryValue, type VtsComputedStatus } from "@/lib/vts/constants";
import type { VtsFleetVehicle } from "@/lib/vts/data";

const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125]; // Dhaka, Bangladesh
const POLL_INTERVAL_MS = 5000;

const STATUS_HEX: Record<VtsComputedStatus, string> = {
  ON_MOVE: "#10b981",
  STOPPED: "#f59e0b",
  STATIC: "#a9a48d",
  WEAK_SIGNAL: "#f97316",
  OFFLINE: "#ef4444",
};

export default function LiveMapClient({
  initialVehicles,
  initialRoutes,
}: {
  initialVehicles: VtsFleetVehicle[];
  initialRoutes: Record<string, [number, number][]>;
}) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});
  const polylinesRef = useRef<Record<string, L.Polyline>>({});

  const [vehicles, setVehicles] = useState<VtsFleetVehicle[]>(initialVehicles);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current).setView(DEFAULT_CENTER, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  function renderVehicles(list: VtsFleetVehicle[], routes: Record<string, [number, number][]>) {
    const map = mapRef.current;
    if (!map) return;

    const seenMarkerIds = new Set<string>();
    const seenRouteIds = new Set<string>();

    for (const v of list) {
      const m = v.activeMovement;
      if (!m || m.lastLat == null || m.lastLng == null) continue;
      seenMarkerIds.add(v.id);

      const pos: [number, number] = [m.lastLat, m.lastLng];
      const color = STATUS_HEX[v.computedStatus];

      let marker = markersRef.current[v.id];
      if (!marker) {
        marker = L.circleMarker(pos, { radius: 9, color: "#1c1a13", weight: 1, fillColor: color, fillOpacity: 0.9 });
        marker.on("click", () => setSelectedId(v.id));
        marker.addTo(map);
        markersRef.current[v.id] = marker;
      } else {
        marker.setLatLng(pos);
        marker.setStyle({ fillColor: color });
      }
      marker.bindTooltip(`${v.baNumber} - ${v.computedStatus.replace("_", " ")}`, { permanent: false });

      const points = routes[m.id];
      if (points && points.length > 1) {
        seenRouteIds.add(v.id);
        let line = polylinesRef.current[v.id];
        if (!line) {
          line = L.polyline(points, { color, weight: 3, opacity: 0.7 });
          line.addTo(map);
          polylinesRef.current[v.id] = line;
        } else {
          line.setLatLngs(points);
        }
      }
    }

    for (const id of Object.keys(markersRef.current)) {
      if (!seenMarkerIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    }
    for (const id of Object.keys(polylinesRef.current)) {
      if (!seenRouteIds.has(id)) {
        polylinesRef.current[id].remove();
        delete polylinesRef.current[id];
      }
    }
  }

  useEffect(() => {
    renderVehicles(initialVehicles, initialRoutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { vehicles: freshVehicles, routes } = await getVtsLiveState();
        setVehicles(freshVehicles);
        renderVehicles(freshVehicles, routes);
      } catch {
        // ignore transient poll failures
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const selected = vehicles.find((v) => v.id === selectedId) ?? null;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        <div ref={mapDivRef} style={{ height: 560 }} />
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow p-3">
          <p className="text-xs text-parchment-500 uppercase mb-2">Active Vehicles</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {vehicles.filter((v) => v.activeMovement).length === 0 && (
              <p className="text-sm text-parchment-500">No vehicles currently on movement.</p>
            )}
            {vehicles
              .filter((v) => v.activeMovement)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-amber-50 ${selectedId === v.id ? "bg-amber-50" : ""}`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: STATUS_HEX[v.computedStatus] }} />
                  {v.baNumber} &middot; {v.computedStatus.replace("_", " ")}
                </button>
              ))}
          </div>
        </div>

        {selected && selected.activeMovement && (
          <VehicleInfoCard vehicle={selected} />
        )}
      </div>
    </div>
  );
}

function VehicleInfoCard({ vehicle }: { vehicle: VtsFleetVehicle }) {
  const m = vehicle.activeMovement!;
  const acc = gpsAccuracyLabel(m.lastAccuracy);
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
      <p className="text-lg font-semibold text-amber-900">{vehicle.baNumber}</p>
      <p className="text-parchment-600">{VTS_CATEGORY_LABELS[vehicle.category as VtsCategoryValue]}</p>
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
      <Row label="Status" value={vehicle.computedStatus.replace("_", " ")} />
      <Row label="Speed" value={m.lastSpeedKmh != null ? `${Math.round(m.lastSpeedKmh)} km/h` : "-"} />
      <Row label="Distance" value={`${m.distanceKm.toFixed(1)} km`} />
      <Row label="Estimated Oil" value={`${m.estimatedOilLiters.toFixed(1)} L`} />
      <Row label="GPS Accuracy" value={m.lastAccuracy != null ? `${Math.round(m.lastAccuracy)} m (${acc.label})` : "-"} />
      <Row label="Last Update" value={formatAgo(m.lastPingAt)} />
      <Row label="Destination" value={m.destination} />
      <Row label="Purpose" value={m.purpose} />
      <Row label="Start Time" value={new Date(m.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
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
