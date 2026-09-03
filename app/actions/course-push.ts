"use server";

import { prisma } from "@/lib/prisma";
import type { CourseCategoryValue } from "@/lib/course/constants";
import type { CourseActionResult } from "@/app/actions/course-auth";

type CourseSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function subscribeToCoursePush(
  category: CourseCategoryValue,
  subscription: CourseSubscriptionInput,
): Promise<CourseActionResult> {
  await prisma.coursePushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { category, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    create: {
      category,
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
