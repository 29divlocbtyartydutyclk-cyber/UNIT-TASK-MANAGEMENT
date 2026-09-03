"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVtsVehicle } from "@/app/actions/vts-vehicles";
import { VTS_CATEGORIES, VTS_CATEGORY_LABELS, type VtsCategoryValue } from "@/lib/vts/constants";

export default function CreateVehicleForm() {
  const router = useRouter();
  const [baNumber, setBaNumber] = useState("");
  const [category, setCategory] = useState<VtsCategoryValue | "">("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileageKmPerLiter, setMileageKmPerLiter] = useState("");
  const [maxSpeedKmh, setMaxSpeedKmh] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!category) {
      setError("Select a category");
      return;
    }
    startTransition(async () => {
      const result = await createVtsVehicle({
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
      setBaNumber("");
      setCategory("");
      setModel("");
      setFuelType("");
      setMileageKmPerLiter("");
      setMaxSpeedKmh("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-amber-900">Register Vehicle</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="BA Number"
          value={baNumber}
          onChange={(e) => setBaNumber(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as VtsCategoryValue)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Category
          </option>
          {VTS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {VTS_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Model (optional)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Fuel type (optional)"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Override mileage km/L (optional)"
          value={mileageKmPerLiter}
          onChange={(e) => setMileageKmPerLiter(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Override max speed km/h (optional)"
          value={maxSpeedKmh}
          onChange={(e) => setMaxSpeedKmh(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Adding..." : "Add Vehicle"}
      </button>
    </form>
  );
}
