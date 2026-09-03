import {
  VTS_OFFLINE_AFTER_SECONDS,
  VTS_WEAK_SIGNAL_AFTER_SECONDS,
  VTS_STOPPED_SPEED_KMH,
  type VtsComputedStatus,
} from "@/lib/vts/constants";

const EARTH_RADIUS_METERS = 6371000;

/** Great-circle distance between two points, in meters. */
export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_METERS * c;
}

/** Computes the live status for an active movement given its last ping time and speed. */
export function computeMovementStatus(params: { lastPingAt: Date | null; lastSpeedKmh: number | null }): VtsComputedStatus {
  const { lastPingAt, lastSpeedKmh } = params;
  if (!lastPingAt) return "WEAK_SIGNAL";

  const secondsSincePing = (Date.now() - lastPingAt.getTime()) / 1000;
  if (secondsSincePing > VTS_OFFLINE_AFTER_SECONDS) return "OFFLINE";
  if (secondsSincePing > VTS_WEAK_SIGNAL_AFTER_SECONDS) return "WEAK_SIGNAL";
  if ((lastSpeedKmh ?? 0) < VTS_STOPPED_SPEED_KMH) return "STOPPED";
  return "ON_MOVE";
}

export function formatAgo(date: Date | null): string {
  if (!date) return "never";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ${seconds % 60} sec ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ${minutes % 60} min ago`;
}

export function gpsAccuracyLabel(accuracy: number | null | undefined): { label: string; level: "GOOD" | "ACCEPTABLE" | "POOR" | "UNKNOWN" } {
  if (accuracy == null) return { label: "Unknown", level: "UNKNOWN" };
  if (accuracy <= 15) return { label: "Good", level: "GOOD" };
  if (accuracy <= 50) return { label: "Acceptable", level: "ACCEPTABLE" };
  return { label: "Poor", level: "POOR" };
}
