import SettingsForms from "./SettingsForms";

export default function VtsAdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-amber-900">Settings</h1>
      <SettingsForms />
    </div>
  );
}
