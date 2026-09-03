"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateVtsVehicle, setVtsVehicleStatus } from "@/app/actions/vts-vehicles";
import { VTS_CATEGORIES, VTS_CATEGORY_LABELS, type VtsCategoryValue } from "@/lib/vts/constants";

type Vehicle = {
  id: string;
  baNumber: string;
  category: string;
  model: string | null;
  fuelType: string | null;
  mileageKmPerLiter: number | null;
  maxSpeedKmh: number | null;
  status: string;
};

export default function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [baNumber, setBaNumber] = useState(vehicle.baNumber);
  const [category, setCategory] = useState<VtsCategoryValue>(vehicle.category as VtsCategoryValue);
  const [model, setModel] = useState(vehicle.model ?? "");
  const [fuelType, setFuelType] = useState(vehicle.fuelType ?? "");
  const [mileageKmPerLiter, setMileageKmPerLiter] = useState(vehicle.mileageKmPerLiter?.toString() ?? "");
  const [maxSpeedKmh, setMaxSpeedKmh] = useState(vehicle.maxSpeedKmh?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateVtsVehicle(vehicle.id, {
        baNumber,
        category,
        model,
        fuelType,
        mileageKmPerLiter: mileageKmPerLiter ? Number(mileageKmPerLiter) : null,
        maxSpeedKmh: maxSpeedKmh ? Number(maxSpeedKmh) : null,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  function onToggleStatus() {
    startTransition(async () => {
      await setVtsVehicleStatus(vehicle.id, vehicle.status === "ACTIVE" ? "DISABLED" : "ACTIVE");
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="p-3 space-y-2 bg-amber-50">
        <div className="grid sm:grid-cols-3 gap-2">
          <input value={baNumber} onChange={(e) => setBaNumber(e.target.value)} className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value as VtsCategoryValue)} className="rounded border border-parchment-300 px-2 py-1 text-sm">
            {VTS_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {VTS_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <input value={fuelType} onChange={(e) => setFuelType(e.target.value)} placeholder="Fuel type" className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <input value={mileageKmPerLiter} onChange={(e) => setMileageKmPerLiter(e.target.value)} placeholder="Mileage km/L" type="number" step="0.1" className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <input value={maxSpeedKmh} onChange={(e) => setMaxSpeedKmh(e.target.value)} placeholder="Max speed km/h" type="number" className="rounded border border-parchment-300 px-2 py-1 text-sm" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button onClick={onSave} disabled={isPending} className="rounded bg-amber-700 text-white text-xs px-3 py-1.5 hover:bg-amber-800">
            Save
          </button>
          <button onClick={() => setEditing(false)} className="rounded bg-parchment-200 text-parchment-800 text-xs px-3 py-1.5 hover:bg-parchment-300">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 flex items-center justify-between gap-3">
      <div>
        <p className="font-medium text-amber-900">
          {vehicle.baNumber}{" "}
          {vehicle.status === "DISABLED" && <span className="text-xs text-red-600">(disabled)</span>}
        </p>
        <p className="text-xs text-parchment-500">
          {VTS_CATEGORY_LABELS[vehicle.category as VtsCategoryValue]}
          {vehicle.model ? ` · ${vehicle.model}` : ""}
          {vehicle.mileageKmPerLiter ? ` · ${vehicle.mileageKmPerLiter} km/L (override)` : ""}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="text-sm text-amber-700 hover:underline">
          Edit
        </button>
        <button onClick={onToggleStatus} disabled={isPending} className="text-sm text-red-600 hover:underline">
          {vehicle.status === "ACTIVE" ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
