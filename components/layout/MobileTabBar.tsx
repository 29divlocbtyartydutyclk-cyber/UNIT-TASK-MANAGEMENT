"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-camo fixed inset-x-0 bottom-0 z-30 flex border-t border-combat-900 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium",
              active ? "text-white" : "text-sand-300"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
