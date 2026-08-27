"use client";

import { STATUSES, type Status } from "@/lib/constants";

export function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (status: Status) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      disabled={disabled}
      aria-label="Change status"
      onClick={(e) => e.stopPropagation()}
      className="rounded border border-sand-300 px-1.5 py-1 text-xs font-medium text-sand-700 focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
