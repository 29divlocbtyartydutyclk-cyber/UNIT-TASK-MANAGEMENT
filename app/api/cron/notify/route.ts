import { NextRequest, NextResponse } from "next/server";
import { eachDayOfInterval, addDays } from "date-fns";
import { getAllTasks } from "@/lib/data/tasks";
import { isTaskActiveOn, today, nextNDays } from "@/lib/utils/date";
import { sendPushToAll } from "@/lib/push";

function summarize(titles: string[], max = 3): string {
  if (titles.length === 0) return "No tasks scheduled.";
  const shown = titles.slice(0, max).join(", ");
  const remaining = titles.length - max;
  return remaining > 0 ? `${shown}, and ${remaining} more` : shown;
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await getAllTasks();

  const tomorrow = addDays(today(), 1);
  const tomorrowTasks = tasks.filter((t) => isTaskActiveOn(t, tomorrow));

  const todayStart = today();
  const { end } = nextNDays(7);
  const upcomingTaskIds = new Set<string>();
  for (const t of tasks) {
    const range = eachDayOfInterval({ start: t.date, end: t.endDate ?? t.date });
    if (range.some((d) => d > todayStart && d <= end)) {
      upcomingTaskIds.add(t.id);
    }
  }
  const upcomingTasks = tasks.filter((t) => upcomingTaskIds.has(t.id));

  await sendPushToAll({
    title: `Tomorrow: ${tomorrowTasks.length} task${tomorrowTasks.length === 1 ? "" : "s"}`,
    body: summarize(tomorrowTasks.map((t) => t.title)),
    url: "/dashboard",
  });

  await sendPushToAll({
    title: `Next 7 days: ${upcomingTasks.length} task${upcomingTasks.length === 1 ? "" : "s"}`,
    body: summarize(upcomingTasks.map((t) => t.title)),
    url: "/dashboard",
  });

  return NextResponse.json({
    sent: true,
    tomorrowCount: tomorrowTasks.length,
    upcomingCount: upcomingTasks.length,
  });
}
