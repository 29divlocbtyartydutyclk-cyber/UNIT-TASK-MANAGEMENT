"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVtsDriver } from "@/app/actions/vts-drivers";

export default function CreateDriverForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createVtsDriver({ name, serviceId, phone });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setName("");
      setServiceId("");
      setPhone("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="font-medium text-amber-900">Register Driver</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Driver Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Service ID Number"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded border border-parchment-300 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-amber-700 text-white text-sm px-4 py-2 hover:bg-amber-800 disabled:opacity-60"
      >
        {isPending ? "Adding..." : "Add Driver"}
      </button>
    </form>
  );
}
