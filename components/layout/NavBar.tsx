"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-camo hidden items-center justify-between border-b border-combat-900 px-6 py-3 text-sand-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] md:flex">
      <Link href="/dashboard" className="text-sm font-semibold tracking-wide uppercase">
        Unit Task Management
      </Link>
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
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
      </nav>
    </header>
  );
}
