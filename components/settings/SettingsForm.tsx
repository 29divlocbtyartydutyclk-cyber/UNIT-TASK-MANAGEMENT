"use client";

import { useState, type FormEvent } from "react";
import type { Settings } from "@prisma/client";
import { REMINDER_PREFERENCES, WEEK_START_OPTIONS, type ReminderPreference, type WeekStart } from "@/lib/constants";
import { updateSettings } from "@/app/actions/settings";

const inputClass =
  "mt-1 w-full max-w-sm rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500";
const labelClass = "block text-sm font-medium text-sand-700";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [unitName, setUnitName] = useState(settings.unitName);
  const [defaultReminder, setDefaultReminder] = useState<ReminderPreference>(
    settings.defaultReminder as ReminderPreference
  );
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStart>(settings.weekStartsOn as WeekStart);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const result = await updateSettings({ unitName, defaultReminder, weekStartsOn });
    if (!result.success) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {status === "error" && error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {status === "saved" && (
        <p className="rounded-md bg-combat-50 px-3 py-2 text-sm text-combat-700">Settings saved.</p>
      )}

      <div>
        <label className={labelClass}>Unit Name</label>
        <input
          required
          value={unitName}
          onChange={(e) => {
            setUnitName(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Default Reminder Preference</label>
        <select
          value={defaultReminder}
          onChange={(e) => {
            setDefaultReminder(e.target.value as ReminderPreference);
            setStatus("idle");
          }}
          className={inputClass}
        >
          {REMINDER_PREFERENCES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Calendar Week Starts On</label>
        <select
          value={weekStartsOn}
          onChange={(e) => {
            setWeekStartsOn(e.target.value as WeekStart);
            setStatus("idle");
          }}
          className={inputClass}
        >
          {WEEK_START_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md bg-combat-600 px-4 py-2 text-sm font-semibold text-white hover:bg-combat-700 disabled:opacity-50"
      >
        {status === "saving" ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
