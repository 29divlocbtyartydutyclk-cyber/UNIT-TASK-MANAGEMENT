"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertVtsCategoryMileage } from "@/app/actions/vts-mileage";
import { VTS_CATEGORY_LABELS, type VtsCategoryValue } from "@/lib/vts/constants";

export default function MileageForm({
  category,
  mileageKmPerLiter,
  maxSpeedKmh,
}: {
  category: VtsCategoryValue;
  mileageKmPerLiter: number;
  maxSpeedKmh: number | null;
}) {
  const router = useRouter();
  const [mileage, setMileage] = useState(mileageKmPerLiter.toString());
  const [maxSpeed, setMaxSpeed] = useState(maxSpeedKmh?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await upsertVtsCategoryMileage({
        category,
        mileageKmPerLiter: Number(mileage),
        maxSpeedKmh: maxSpeed ? Number(maxSpeed) : null,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 flex flex-wrap items-end gap-3">
      <div className="w-28">
        <p className="text-sm font-medium text-amber-900">{VTS_CATEGORY_LABELS[category]}</p>
      </div>
      <label className="text-sm text-parchment-700">
        Mileage (km/L)
        <input
          type="number"
          step="0.1"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          className="mt-1 block w-32 rounded border border-parchment-300 px-2 py-1 text-sm"
          required
        />
      </label>
      <label className="text-sm text-parchment-700">
        Max speed (km/h, optional)
        <input
          type="number"
          value={maxSpeed}
          onChange={(e) => setMaxSpeed(e.target.value)}
          className="mt-1 block w-40 rounded border border-parchment-300 px-2 py-1 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
      {success && <span className="text-sm text-emerald-700">Saved</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}
