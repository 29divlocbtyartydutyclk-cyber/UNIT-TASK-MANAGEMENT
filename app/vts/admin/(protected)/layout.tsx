import Link from "next/link";
import { redirect } from "next/navigation";
import { getVtsSession } from "@/lib/vts/auth/server";
import { vtsLogout } from "@/app/actions/vts-auth";

export default async function VtsAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getVtsSession();
  if (!session || session.role !== "ADMIN") redirect("/vts/admin/login");

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="bg-amber-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="font-semibold">VTS &middot; Admin</span>
            <nav className="flex gap-4 text-sm flex-wrap">
              <Link href="/vts/admin" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/vts/admin/map" className="hover:underline">
                Live Map
              </Link>
              <Link href="/vts/admin/vehicles" className="hover:underline">
                Vehicles
              </Link>
              <Link href="/vts/admin/drivers" className="hover:underline">
                Drivers
              </Link>
              <Link href="/vts/admin/mileage" className="hover:underline">
                Mileage
              </Link>
              <Link href="/vts/admin/alerts" className="hover:underline">
                Alerts
              </Link>
              <Link href="/vts/admin/settings" className="hover:underline">
                Settings
              </Link>
            </nav>
          </div>
          <form action={vtsLogout}>
            <button type="submit" className="text-sm hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
