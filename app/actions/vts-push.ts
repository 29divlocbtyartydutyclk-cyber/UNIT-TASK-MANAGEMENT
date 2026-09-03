"use server";

import { prisma } from "@/lib/prisma";
import { requireVtsAdmin } from "@/lib/vts/auth/server";
import type { VtsActionResult } from "@/app/actions/vts-auth";

type VtsSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function subscribeToVtsPush(input: VtsSubscriptionInput): Promise<VtsActionResult> {
  await requireVtsAdmin();
  await prisma.vtsPushSubscription.upsert({
    where: { endpoint: input.endpoint },
    update: { p256dh: input.keys.p256dh, auth: input.keys.auth },
    create: { endpoint: input.endpoint, p256dh: input.keys.p256dh, auth: input.keys.auth },
  });
  return { success: true };
}

export async function unsubscribeFromVtsPush(endpoint: string): Promise<VtsActionResult> {
  await requireVtsAdmin();
  await prisma.vtsPushSubscription.delete({ where: { endpoint } }).catch(() => {});
  return { success: true };
}
