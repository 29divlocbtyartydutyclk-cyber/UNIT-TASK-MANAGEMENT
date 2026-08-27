import { prisma } from "@/lib/prisma";

export function getAllTasks() {
  return prisma.task.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] });
}
