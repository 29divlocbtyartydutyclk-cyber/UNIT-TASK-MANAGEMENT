import "server-only";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import type { CourseCategoryValue } from "@/lib/course/constants";

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails("mailto:admin@example.com", publicKey, privateKey);
  vapidConfigured = true;
}

type CoursePushPayload = { title: string; body: string; url?: string };

async function dispatch(
  subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[],
  payload: CoursePushPayload,
) {
  ensureVapidConfigured();
  if (!vapidConfigured) return;

  const json = JSON.stringify(payload);
  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          json,
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.coursePushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    }),
  );
}

export async function sendCoursePushToAll(payload: CoursePushPayload) {
  const subscriptions = await prisma.coursePushSubscription.findMany();
  await dispatch(subscriptions, payload);
}

export async function sendCoursePushToCategory(category: CourseCategoryValue, payload: CoursePushPayload) {
  const subscriptions = await prisma.coursePushSubscription.findMany({ where: { category } });
  await dispatch(subscriptions, payload);
}
