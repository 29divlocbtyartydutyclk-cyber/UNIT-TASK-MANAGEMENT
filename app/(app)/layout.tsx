import { getSessionRole } from "@/lib/auth/server";
import { RoleProvider } from "@/components/auth/RoleProvider";
import { NavBar } from "@/components/layout/NavBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = await getSessionRole();

  return (
    <RoleProvider role={role}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileTabBar />
      </div>
    </RoleProvider>
  );
}
