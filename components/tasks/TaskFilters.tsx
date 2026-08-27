"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BRANCHES, CATEGORIES, STATUSES } from "@/lib/constants";

const STATUS_OPTIONS = ["All", ...STATUSES, "Overdue"];

const selectClass =
  "rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500";

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(currentSearch);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") params.delete(key);
    else params.set(key, value);
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== currentSearch) updateParam("search", search);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <input
        type="search"
        placeholder="Search by task name or responsible person..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-sand-300 px-3 py-2 text-sm focus:border-combat-500 focus:outline-none focus:ring-1 focus:ring-combat-500 md:max-w-xs"
      />
      <select
        value={searchParams.get("branch") ?? "All"}
        onChange={(e) => updateParam("branch", e.target.value)}
        className={selectClass}
      >
        <option value="All">All Branches</option>
        {BRANCHES.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("category") ?? "All"}
        onChange={(e) => updateParam("category", e.target.value)}
        className={selectClass}
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("status") ?? "All"}
        onChange={(e) => updateParam("status", e.target.value)}
        className={selectClass}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === "All" ? "All Statuses" : s}
          </option>
        ))}
      </select>
    </div>
  );
}
