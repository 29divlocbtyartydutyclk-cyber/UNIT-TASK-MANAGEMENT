export const VTS_CATEGORIES = ["JEEP", "PICKUP", "THREE_TON", "OTHER"] as const;
export type VtsCategoryValue = (typeof VTS_CATEGORIES)[number];

export const VTS_CATEGORY_LABELS: Record<VtsCategoryValue, string> = {
  JEEP: "Jeep",
  PICKUP: "Pickup",
  THREE_TON: "3 Ton",
  OTHER: "Other",
};

export const VTS_DEFAULT_MILEAGE_KM_PER_LITER: Record<VtsCategoryValue, number> = {
  JEEP: 8,
  PICKUP: 6,
  THREE_TON: 4,
  OTHER: 5,
};

export const VTS_ADMIN_SERVICE_NUMBER = "ADMIN";

// A vehicle/movement is ON_MOVE if a ping arrived within this window.
export const VTS_WEAK_SIGNAL_AFTER_SECONDS = 45;
// Beyond this, the vehicle is considered OFFLINE (comms lost entirely).
export const VTS_OFFLINE_AFTER_SECONDS = 5 * 60;
// Below this speed while ON_MOVE-fresh, the vehicle reads as STOPPED rather than ON_MOVE.
export const VTS_STOPPED_SPEED_KMH = 3;

// Route/ping efficiency: only record a new route point and count distance
// once the vehicle has moved at least this far from the last recorded point.
export const VTS_MIN_DISTANCE_METERS = 25;
// Client-side minimum time between location pings sent to the server.
export const VTS_MIN_PING_INTERVAL_MS = 8000;

export type VtsComputedStatus = "ON_MOVE" | "STOPPED" | "STATIC" | "WEAK_SIGNAL" | "OFFLINE";

export const VTS_STATUS_COLORS: Record<VtsComputedStatus, { bg: string; text: string; dot: string }> = {
  ON_MOVE: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  STOPPED: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  STATIC: { bg: "bg-parchment-100", text: "text-parchment-600", dot: "bg-parchment-400" },
  WEAK_SIGNAL: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  OFFLINE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};
