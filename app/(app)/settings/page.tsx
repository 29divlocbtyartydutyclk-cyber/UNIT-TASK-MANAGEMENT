import { redirect } from "next/navigation";
import { getSettings } from "@/lib/data/settings";
import { getSessionRole } from "@/lib/auth/server";
import { isAdmin } from "@/lib/auth/session";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { RolePasswordsForm } from "@/components/settings/RolePasswordsForm";

export default async function SettingsPage() {
  const role = await getSessionRole();
  if (!isAdmin(role)) {
    redirect("/dashboard");
  }

  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-combat-800">Settings</h1>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-combat-800">Role Passwords</h2>
        <p className="mt-1 text-sm text-sand-500">
          Change the shared sign-in password for each role. Members select their role and use that role&apos;s
          password to sign in.
        </p>
        <div className="mt-4">
          <RolePasswordsForm />
        </div>
      </div>
    </div>
  );
}
