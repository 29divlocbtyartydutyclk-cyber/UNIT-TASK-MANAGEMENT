"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateVtsDriver, setVtsDriverStatus } from "@/app/actions/vts-drivers";

type Driver = { id: string; name: string; serviceId: string; phone: string | null; status: string };

export default function DriverRow({ driver, activeVehicle }: { driver: Driver; activeVehicle: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(driver.name);
  const [serviceId, setServiceId] = useState(driver.serviceId);
  const [phone, setPhone] = useState(driver.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateVtsDriver(driver.id, { name, serviceId, phone });
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
      await setVtsDriverStatus(driver.id, driver.status === "ACTIVE" ? "DISABLED" : "ACTIVE");
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="p-3 space-y-2 bg-amber-50">
        <div className="grid sm:grid-cols-3 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <input value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="rounded border border-parchment-300 px-2 py-1 text-sm" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="tel" className="rounded border border-parchment-300 px-2 py-1 text-sm" />
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
          {driver.name} <span className="text-parchment-500 font-normal">({driver.serviceId})</span>{" "}
          {driver.status === "DISABLED" && <span className="text-xs text-red-600">(disabled)</span>}
        </p>
        {driver.phone && <p className="text-xs text-parchment-500">{driver.phone}</p>}
        {activeVehicle && <p className="text-xs text-parchment-500">Currently driving: {activeVehicle}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="text-sm text-amber-700 hover:underline">
          Edit
        </button>
        <button onClick={onToggleStatus} disabled={isPending} className="text-sm text-red-600 hover:underline">
          {driver.status === "ACTIVE" ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
