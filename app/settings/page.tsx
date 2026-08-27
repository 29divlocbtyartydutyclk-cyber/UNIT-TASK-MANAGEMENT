import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-combat-800">Settings</h1>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
