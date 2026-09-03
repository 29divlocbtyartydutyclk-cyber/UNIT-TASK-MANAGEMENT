import { getVtsAlerts } from "@/lib/vts/data";
import { formatAgo } from "@/lib/vts/geo";

const TYPE_LABELS: Record<string, string> = {
  MOVEMENT_STARTED: "Movement Started",
  MOVEMENT_ENDED: "Movement Ended",
  SPEED_EXCEEDED: "Speed Alert",
  GPS_POOR: "GPS Poor",
  NETWORK_LOST: "Network Lost",
  WEAK_SIGNAL: "Weak Signal",
  OFFLINE: "Vehicle Offline",
};

const TYPE_COLORS: Record<string, string> = {
  MOVEMENT_STARTED: "text-emerald-700",
  MOVEMENT_ENDED: "text-parchment-600",
  SPEED_EXCEEDED: "text-red-600",
  GPS_POOR: "text-orange-600",
  NETWORK_LOST: "text-orange-600",
  WEAK_SIGNAL: "text-orange-600",
  OFFLINE: "text-red-600",
};

export default async function VtsAdminAlertsPage() {
  const alerts = await getVtsAlerts(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-amber-900">Alert Center</h1>
      <div className="bg-white rounded-lg shadow divide-y divide-parchment-100">
        {alerts.length === 0 && <p className="p-4 text-sm text-parchment-500">No alerts yet.</p>}
        {alerts.map((a) => (
          <div key={a.id} className="p-3 flex items-center justify-between gap-3">
            <div>
              <p className={`text-sm font-medium ${TYPE_COLORS[a.type] ?? "text-parchment-800"}`}>
                {TYPE_LABELS[a.type] ?? a.type}
              </p>
              <p className="text-sm text-parchment-700">{a.message}</p>
              {a.baNumber && <p className="text-xs text-parchment-500">{a.baNumber}</p>}
            </div>
            <p className="text-xs text-parchment-500 shrink-0">{formatAgo(a.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
