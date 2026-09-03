"use client";

import { useState, useTransition } from "react";
import { startVtsMovement } from "@/app/actions/vts-movements";
import { VTS_CATEGORY_LABELS, type VtsCategoryValue } from "@/lib/vts/constants";

type Vehicle = { id: string; baNumber: string; category: string; busy: boolean };

export default function StartMovementForm({ vehicles }: { vehicles: Vehicle[] }) {
  const [step, setStep] = useState<"select" | "info" | "confirm">("select");
  const [vehicleId, setVehicleId] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [startingOdometerKm, setStartingOdometerKm] = useState("");
  const [passengers, setPassengers] = useState("");
  const [expectedDurationMin, setExpectedDurationMin] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId) ?? null;

  function onSubmitInfo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!destination.trim() || !purpose.trim()) {
      setError("Destination and purpose are required");
      return;
    }
    setStep("confirm");
  }

  function onConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await startVtsMovement({
        vehicleId,
        destination,
        purpose,
        startingOdometerKm: startingOdometerKm ? Number(startingOdometerKm) : null,
        passengers: passengers ? Number(passengers) : null,
        expectedDurationMin: expectedDurationMin ? Number(expectedDurationMin) : null,
        remarks,
      });
      if (result && !result.success) setError(result.error);
    });
  }

  if (step === "select") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-amber-900">Select Vehicle</h1>
        {vehicles.length === 0 ? (
          <p className="text-sm text-parchment-600">No active vehicles registered - contact admin.</p>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
            {vehicles.map((v) => (
              <button
                key={v.id}
                disabled={v.busy}
                onClick={() => {
                  setVehicleId(v.id);
                  setStep("info");
                }}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <div>
                  <p className="font-medium text-amber-900">{v.baNumber}</p>
                  <p className="text-xs text-parchment-500">{VTS_CATEGORY_LABELS[v.category as VtsCategoryValue]}</p>
                </div>
                {v.busy && <span className="text-xs text-red-600">On movement</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === "info" && selectedVehicle) {
    return (
      <form onSubmit={onSubmitInfo} className="space-y-4">
        <div>
          <button type="button" onClick={() => setStep("select")} className="text-sm text-amber-700 hover:underline">
            &larr; Change vehicle
          </button>
          <h1 className="text-xl font-semibold text-amber-900 mt-1">
            {selectedVehicle.baNumber} &middot; {VTS_CATEGORY_LABELS[selectedVehicle.category as VtsCategoryValue]}
          </h1>
        </div>

        <div>
          <label className="block text-sm font-medium text-parchment-700 mb-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-parchment-700 mb-1">Purpose of Movement</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Starting Odometer (km)</label>
            <input
              type="number"
              value={startingOdometerKm}
              onChange={(e) => setStartingOdometerKm(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-parchment-700 mb-1">Passengers</label>
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-parchment-700 mb-1">
            Expected Duration (minutes, optional)
          </label>
          <input
            type="number"
            value={expectedDurationMin}
            onChange={(e) => setExpectedDurationMin(e.target.value)}
            className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-parchment-700 mb-1">Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded border border-parchment-300 px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="w-full rounded bg-amber-700 text-white py-2.5 font-medium hover:bg-amber-800">
          Continue
        </button>
      </form>
    );
  }

  if (step === "confirm" && selectedVehicle) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setStep("info")} className="text-sm text-amber-700 hover:underline">
          &larr; Edit details
        </button>
        <div className="bg-white rounded-lg shadow p-5 space-y-3">
          <h1 className="text-lg font-semibold text-amber-900">Confirm Movement</h1>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-parchment-500">Vehicle</dt>
              <dd className="font-medium">{selectedVehicle.baNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-parchment-500">Category</dt>
              <dd>{VTS_CATEGORY_LABELS[selectedVehicle.category as VtsCategoryValue]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-parchment-500">Destination</dt>
              <dd>{destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-parchment-500">Purpose</dt>
              <dd>{purpose}</dd>
            </div>
          </dl>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={onConfirm}
          disabled={isPending}
          className="w-full rounded bg-amber-700 text-white py-3 text-lg font-semibold hover:bg-amber-800 disabled:opacity-60"
        >
          {isPending ? "Starting..." : "START MOV"}
        </button>
      </div>
    );
  }

  return null;
}
