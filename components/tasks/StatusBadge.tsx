import { STATUS_COLORS, type DisplayStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: DisplayStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center rounded-full ${c.bg} ${c.text} px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap`}
    >
      {status}
    </span>
  );
}
