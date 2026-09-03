"use server";

import { prisma } from "@/lib/prisma";
import { getCourseSession } from "@/lib/course/auth/server";
import type { CourseActionResult } from "@/app/actions/course-auth";

type CourseSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function subscribeToCoursePush(subscription: CourseSubscriptionInput): Promise<CourseActionResult> {
  const session = await getCourseSession();
  if (!session) return { success: false, error: "Not signed in" };

  await prisma.coursePushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { userId: session.sub, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    create: {
      userId: session.sub,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
  return { success: true };
}

export async function unsubscribeFromCoursePush(endpoint: string): Promise<CourseActionResult> {
  await prisma.coursePushSubscription.delete({ where: { endpoint } }).catch(() => {});
  return { success: true };
}
