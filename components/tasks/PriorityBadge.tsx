import { PRIORITY_COLORS, type Priority } from "@/lib/constants";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = PRIORITY_COLORS[priority];
  return (
    <span className={`inline-flex items-center rounded ${c.bg} ${c.text} px-2 py-0.5 text-xs font-medium whitespace-nowrap`}>
      {priority}
    </span>
  );
}
