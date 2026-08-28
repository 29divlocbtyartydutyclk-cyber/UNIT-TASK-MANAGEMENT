"use server";

import { prisma } from "@/lib/prisma";

export type PushSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function subscribeToPush(input: PushSubscriptionInput): Promise<{ success: boolean }> {
  await prisma.pushSubscription.upsert({
    where: { endpoint: input.endpoint },
    update: { p256dh: input.keys.p256dh, auth: input.keys.auth },
    create: { endpoint: input.endpoint, p256dh: input.keys.p256dh, auth: input.keys.auth },
  });
  return { success: true };
}

export async function unsubscribeFromPush(endpoint: string): Promise<{ success: boolean }> {
  await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {});
  return { success: true };
}
