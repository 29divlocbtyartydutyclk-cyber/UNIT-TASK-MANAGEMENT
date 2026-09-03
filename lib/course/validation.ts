import { z } from "zod";
import {
  COURSE_CATEGORIES,
  COURSE_MAX_QUIZ_TIME_LIMIT_SECONDS,
  COURSE_MIN_QUIZ_TIME_LIMIT_SECONDS,
} from "@/lib/course/constants";

export const courseRegisterSchema = z.object({
  serviceNumber: z.string().trim().min(2, "Service number is required").max(40),
  name: z.string().trim().min(1, "Name is required").max(120),
  rank: z.string().trim().max(60).optional().transform((v) => (v ? v : undefined)),
  category: z.enum(COURSE_CATEGORIES, { message: "Select your category" }),
  password: z.string().min(6, "Password must be at least 6 characters").max(200),
});

export type CourseRegisterInput = z.infer<typeof courseRegisterSchema>;

export const courseLoginSchema = z.object({
  serviceNumber: z.string().trim().min(1, "Service number is required"),
  password: z.string().min(1, "Password is required"),
});

export type CourseLoginInput = z.infer<typeof courseLoginSchema>;

export const courseChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(200),
});

export type CourseChangePasswordInput = z.infer<typeof courseChangePasswordSchema>;

export const courseSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.enum(COURSE_CATEGORIES, { message: "Category is required" }),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : undefined)),
  order: z.coerce.number().int().default(0),
});

export type CourseInput = z.infer<typeof courseSchema>;

export const courseDocumentMetaSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
});

export const courseQuizSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
  timeLimitSeconds: z.coerce
    .number()
    .int()
    .min(COURSE_MIN_QUIZ_TIME_LIMIT_SECONDS, "Time limit is too short")
    .max(COURSE_MAX_QUIZ_TIME_LIMIT_SECONDS, "Time limit is too long"),
  questionsPerAttempt: z.coerce.number().int().min(1, "At least 1 question is required").max(200),
});

export type CourseQuizInput = z.infer<typeof courseQuizSchema>;

export const courseQuestionSchema = z.object({
  quizId: z.string().min(1),
  text: z.string().trim().min(1, "Question text is required").max(2000),
  optionA: z.string().trim().min(1, "Option A is required").max(500),
  optionB: z.string().trim().min(1, "Option B is required").max(500),
  optionC: z.string().trim().min(1, "Option C is required").max(500),
  optionD: z.string().trim().min(1, "Option D is required").max(500),
  correctOptionIndex: z.coerce.number().int().min(0).max(3),
  explanation: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export type CourseQuestionInput = z.infer<typeof courseQuestionSchema>;

export const courseSubmitAttemptSchema = z.object({
  attemptId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      chosenOptionIndex: z.number().int().min(0).max(3).nullable(),
    }),
  ),
});

export type CourseSubmitAttemptInput = z.infer<typeof courseSubmitAttemptSchema>;
