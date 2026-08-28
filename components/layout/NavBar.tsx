"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { useIsAdmin, useRole } from "@/components/auth/RoleProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function NavBar() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const role = useRole();
  const items = NAV_ITEMS.filter((item) => item.href !== "/settings" || isAdmin);

  return (
    <header className="hidden items-center justify-between border-b border-combat-900 bg-combat-800 px-6 py-3 text-sand-50 md:flex">
      <Link href="/dashboard" className="text-sm font-semibold tracking-wide uppercase">
        Unit Task Management
      </Link>
      <nav className="flex items-center gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-combat-600 text-white" : "text-sand-100 hover:bg-combat-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <span className="ml-2 rounded-md bg-combat-900/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sand-200">
          {role}
        </span>
        <LogoutButton className="ml-1 rounded-md px-3 py-2 text-sm font-medium text-sand-100 hover:bg-combat-700" />
      </nav>
    </header>
  );
}
