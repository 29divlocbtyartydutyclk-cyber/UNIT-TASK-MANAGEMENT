import ChangePasswordForm from "./ChangePasswordForm";

export default function CourseAdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-study-800">Settings</h1>
        <p className="text-sm text-parchment-600 mt-1">
          Admin username is fixed as <span className="font-mono">ADMIN</span>. You can change the password below.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
