export function SummaryTile({
  label,
  value,
  accent,
  barColor,
}: {
  label: string;
  value: number;
  accent?: string;
  barColor?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-sand-200 border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        barColor ?? "border-l-combat-600"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-sand-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent ?? "text-combat-800"}`}>{value}</p>
    </div>
  );
}
