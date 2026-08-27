import { CATEGORY_COLORS, type Category } from "@/lib/constants";

export function CategoryBadge({ category }: { category: Category }) {
  const c = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border-l-4 ${c.border} ${c.bg} ${c.text} px-2 py-0.5 text-xs font-medium whitespace-nowrap`}
    >
      {category}
    </span>
  );
}
