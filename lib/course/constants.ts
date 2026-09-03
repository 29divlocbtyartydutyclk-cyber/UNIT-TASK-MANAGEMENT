export const COURSE_CATEGORIES = ["OFFICER", "JCO", "OR"] as const;
export type CourseCategoryValue = (typeof COURSE_CATEGORIES)[number];

export const COURSE_CATEGORY_LABELS: Record<CourseCategoryValue, string> = {
  OFFICER: "Officer",
  JCO: "JCO",
  OR: "Other Ranks",
};

export const COURSE_CATEGORY_COLORS: Record<CourseCategoryValue, { bg: string; text: string; border: string; dot: string }> = {
  OFFICER: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-500", dot: "bg-blue-500" },
  JCO: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-500", dot: "bg-amber-500" },
  OR: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-500", dot: "bg-emerald-500" },
};

export const COURSE_ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "application/epub+zip": ".epub",
  "image/png": ".png",
  "image/jpeg": ".jpg",
};

export const COURSE_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const COURSE_MIN_QUIZ_TIME_LIMIT_SECONDS = 30;
export const COURSE_MAX_QUIZ_TIME_LIMIT_SECONDS = 3 * 60 * 60;

export const COURSE_ADMIN_SERVICE_NUMBER = "ADMIN";
