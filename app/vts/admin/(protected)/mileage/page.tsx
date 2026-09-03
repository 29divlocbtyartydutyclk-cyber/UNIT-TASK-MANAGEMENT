import { prisma } from "@/lib/prisma";
import { VTS_CATEGORIES, VTS_DEFAULT_MILEAGE_KM_PER_LITER, type VtsCategoryValue } from "@/lib/vts/constants";
import MileageForm from "./MileageForm";

export default async function VtsAdminMileagePage() {
  const settings = await prisma.vtsCategoryMileage.findMany();
  const byCategory = new Map(settings.map((s) => [s.category, s]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-900">Mileage & Speed Settings</h1>
        <p className="text-sm text-parchment-600 mt-1">
          Estimated Oil Consumed = Distance Travelled ÷ Mileage (km/L). Vehicles can override these per-vehicle.
        </p>
      </div>

      <div className="space-y-3">
        {VTS_CATEGORIES.map((category) => {
          const existing = byCategory.get(category as VtsCategoryValue);
          return (
            <MileageForm
              key={category}
              category={category}
              mileageKmPerLiter={existing?.mileageKmPerLiter ?? VTS_DEFAULT_MILEAGE_KM_PER_LITER[category]}
              maxSpeedKmh={existing?.maxSpeedKmh ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
