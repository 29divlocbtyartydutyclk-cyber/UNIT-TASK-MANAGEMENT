"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { pingVtsMovement, endVtsMovement } from "@/app/actions/vts-movements";
import { VTS_CATEGORY_LABELS, VTS_MIN_PING_INTERVAL_MS, type VtsCategoryValue } from "@/lib/vts/constants";
import { gpsAccuracyLabel } from "@/lib/vts/geo";

type Props = {
  movementId: string;
  baNumber: string;
  category: string;
  driverName: string;
  serviceId: string;
  destination: string;
  startedAt: string;
  initialDistanceKm: number;
  initialEstimatedOilLiters: number;
};

export default function ActiveMovementClient(props: Props) {
  const [distanceKm, setDistanceKm] = useState(props.initialDistanceKm);
  const [estimatedOilLiters, setEstimatedOilLiters] = useState(props.initialEstimatedOilLiters);
  const [speedKmh, setSpeedKmh] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gpsState, setGpsState] = useState<"REQUESTING" | "GOOD" | "WEAK" | "UNAVAILABLE">(() =>
    typeof navigator !== "undefined" && "geolocation" in navigator ? "REQUESTING" : "UNAVAILABLE",
  );
  const [networkState, setNetworkState] = useState<"CONNECTED" | "LOST">(
    typeof navigator !== "undefined" && navigator.onLine === false ? "LOST" : "CONNECTED",
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEnding, startEndTransition] = useTransition();

  const lastPingRef = useRef(0);

  useEffect(() => {
    function handleOnline() {
      setNetworkState("CONNECTED");
    }
    function handleOffline() {
      setNetworkState("LOST");
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const acc = position.coords.accuracy;
        setAccuracy(acc);
        setGpsState(acc <= 50 ? "GOOD" : "WEAK");

        const speed = position.coords.speed != null && position.coords.speed >= 0 ? position.coords.speed * 3.6 : null;
        if (speed != null) setSpeedKmh(speed);

        const now = Date.now();
        if (now - lastPingRef.current < VTS_MIN_PING_INTERVAL_MS) return;
        lastPingRef.current = now;

        pingVtsMovement({
          movementId: props.movementId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: acc,
          speedKmh: speed,
          heading: position.coords.heading,
        })
          .then((result) => {
            setNetworkState("CONNECTED");
            if (result.success) {
              setDistanceKm(result.distanceKm);
              setEstimatedOilLiters(result.estimatedOilLiters);
            }
          })
          .catch(() => setNetworkState("LOST"));
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGpsState("UNAVAILABLE");
        else setGpsState("WEAK");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [props.movementId]);

  function onEndConfirmed() {
    startEndTransition(async () => {
      await endVtsMovement(props.movementId);
    });
  }

  const accLabel = gpsAccuracyLabel(accuracy);
  const startTime = new Date(props.startedAt);

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-amber-700">Tracking Active</p>
          <h1 className="text-2xl font-bold text-amber-900">{props.baNumber}</h1>
          <p className="text-sm text-parchment-600">
            {VTS_CATEGORY_LABELS[props.category as VtsCategoryValue]}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <Row label="Driver" value={`${props.driverName} (${props.serviceId})`} />
          <Row label="GPS" value={gpsState} valueClass={gpsState === "GOOD" ? "text-emerald-700" : gpsState === "UNAVAILABLE" ? "text-red-600" : "text-amber-700"} />
          <Row label="GPS Accuracy" value={accuracy != null ? `${Math.round(accuracy)} m (${accLabel.label})` : "-"} />
          <Row label="Network" value={networkState === "CONNECTED" ? "CONNECTED" : "LOST"} valueClass={networkState === "CONNECTED" ? "text-emerald-700" : "text-red-600"} />
          <Row label="Speed" value={speedKmh != null ? `${Math.round(speedKmh)} km/h` : "-"} />
          <Row label="Distance" value={`${distanceKm.toFixed(1)} km`} />
          <Row label="Estimated Oil" value={`${estimatedOilLiters.toFixed(1)} L`} />
          <Row label="Destination" value={props.destination} />
          <Row label="Start Time" value={startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
        </div>

        {gpsState === "UNAVAILABLE" && (
          <p className="text-sm text-red-600 text-center">
            Location access is unavailable. Enable GPS/location permission to continue tracking.
          </p>
        )}

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full rounded bg-red-600 text-white py-3 text-lg font-semibold hover:bg-red-700"
          >
            END MOV
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 space-y-3 text-center">
            <p className="text-sm text-parchment-700">Are you sure you want to end this movement?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded bg-parchment-200 text-parchment-800 py-2 text-sm font-medium hover:bg-parchment-300"
              >
                Cancel
              </button>
              <button
                onClick={onEndConfirmed}
                disabled={isEnding}
                className="rounded bg-red-600 text-white py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-60"
              >
                {isEnding ? "Ending..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-parchment-500">{label}</span>
      <span className={`font-medium ${valueClass ?? "text-parchment-800"}`}>{value}</span>
    </div>
  );
}
