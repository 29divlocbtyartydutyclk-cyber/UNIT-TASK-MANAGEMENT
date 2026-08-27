export function SummaryTile({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-sand-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? "text-combat-800"}`}>{value}</p>
    </div>
  );
}
