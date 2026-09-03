import Link from "next/link";
import { getVtsFleetState } from "@/lib/vts/data";
import {
  VTS_CATEGORIES,
  VTS_CATEGORY_LABELS,
  VTS_STATUS_COLORS,
  type VtsComputedStatus,
} from "@/lib/vts/constants";

const ALL_STATUSES: VtsComputedStatus[] = ["ON_MOVE", "STOPPED", "STATIC", "WEAK_SIGNAL", "OFFLINE"];

export default async function VtsAdminDashboardPage() {
  const vehicles = await getVtsFleetState();

  const statusCounts: Record<VtsComputedStatus, number> = {
    ON_MOVE: 0,
    STOPPED: 0,
    STATIC: 0,
    WEAK_SIGNAL: 0,
    OFFLINE: 0,
  };
  for (const v of vehicles) statusCounts[v.computedStatus]++;

  const categoryCounts: Record<string, number> = {};
  for (const category of VTS_CATEGORIES) categoryCounts[category] = 0;
  for (const v of vehicles) categoryCounts[v.category] = (categoryCounts[v.category] ?? 0) + 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-amber-900">Vehicle Dashboard</h1>
        <Link href="/vts/admin/map" className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800">
          Open Live Map &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatTile href="/vts/admin/dashboard/all/all" label="Total Vehicles" value={vehicles.length} />
        {ALL_STATUSES.map((status) => (
          <StatTile
            key={status}
            href={`/vts/admin/dashboard/status/${status}`}
            label={status.replace("_", " ")}
            value={statusCounts[status]}
            colorClass={VTS_STATUS_COLORS[status].text}
          />
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-parchment-700 mb-2">By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VTS_CATEGORIES.map((c) => (
            <StatTile
              key={c}
              href={`/vts/admin/dashboard/category/${c}`}
              label={VTS_CATEGORY_LABELS[c]}
              value={categoryCounts[c] ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatTile({
  href,
  label,
  value,
  colorClass,
}: {
  href: string;
  label: string;
  value: number;
  colorClass?: string;
}) {
  return (
    <Link href={href} className="text-left bg-white rounded-lg shadow p-4 hover:shadow-md hover:ring-2 hover:ring-amber-300 transition block">
      <p className="text-xs text-parchment-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-semibold ${colorClass ?? "text-amber-900"}`}>{value}</p>
    </Link>
  );
}
