"use client";

import { useEffect, useState } from "react";
import { subscribeToVtsPush, unsubscribeFromVtsPush } from "@/app/actions/vts-push";

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "unsupported" | "checking" | "off" | "on" | "working";

export default function VtsNotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      queueMicrotask(() => setStatus("unsupported"));
      return;
    }
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setStatus(sub ? "on" : "off"))
      .catch(() => setStatus("off"));
  }, []);

  async function enable() {
    setError(null);
    setStatus("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notification permission was not granted.");
        setStatus("off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      const json = sub.toJSON();
      await subscribeToVtsPush({
        endpoint: sub.endpoint,
        keys: { p256dh: json.keys!.p256dh!, auth: json.keys!.auth! },
      });
      setStatus("on");
    } catch {
      setError("Could not enable notifications on this device.");
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("working");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribeFromVtsPush(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setError("Could not disable notifications.");
      setStatus("on");
    }
  }

  if (status === "unsupported") {
    return <p className="text-sm text-parchment-500">Notifications aren&apos;t supported in this browser.</p>;
  }
  if (status === "checking") {
    return <p className="text-sm text-parchment-500">Checking notification status...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-amber-900">Alert Notifications</h2>
      <p className="text-sm text-parchment-600">
        {status === "on"
          ? "This device will get a push notification for movement start/end and speed alerts."
          : "Turn this on to get a push notification on this device when a driver starts/ends a movement or exceeds the speed limit."}
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={status === "working"}
        onClick={status === "on" ? disable : enable}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {status === "working" ? "Working..." : status === "on" ? "Disable Notifications" : "Enable Notifications"}
      </button>
    </div>
  );
}
