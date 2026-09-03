import "server-only";
import fs from "node:fs";
import fs_promises from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { COURSE_ALLOWED_MIME_TYPES } from "@/lib/course/constants";

export function getCourseUploadsRoot(): string {
  // Deliberately dynamic (fixed relative path, outside the app bundle) - not something the bundler should trace.
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), "storage", "course-uploads");
}

export function extensionForMimeType(mimeType: string): string | null {
  return COURSE_ALLOWED_MIME_TYPES[mimeType] ?? null;
}

/** Builds a server-generated relative path for a new upload. Never derive this from user input. */
export async function buildCourseStoredPath(courseId: string, mimeType: string): Promise<string> {
  const ext = extensionForMimeType(mimeType);
  if (!ext) throw new Error(`Unsupported file type: ${mimeType}`);

  const relativeDir = path.join("courses", courseId);
  const absoluteDir = path.join(getCourseUploadsRoot(), relativeDir);
  await fs_promises.mkdir(absoluteDir, { recursive: true });

  const fileName = `${randomUUID()}${ext}`;
  return path.join(relativeDir, fileName);
}

export async function saveCourseFile(storedFilePath: string, data: Buffer): Promise<void> {
  const absolutePath = resolveCourseStoredPath(storedFilePath);
  await fs_promises.writeFile(absolutePath, data);
}

export async function deleteCourseFile(storedFilePath: string): Promise<void> {
  const absolutePath = resolveCourseStoredPath(storedFilePath);
  await fs_promises.unlink(absolutePath).catch(() => {});
}

/** Resolves a DB-stored relative path to an absolute path, guarding against path traversal. */
export function resolveCourseStoredPath(storedFilePath: string): string {
  const root = getCourseUploadsRoot();
  // Deliberately dynamic (root is fixed, storedFilePath comes from the DB) - not app-bundle content.
  const resolved = path.resolve(/*turbopackIgnore: true*/ root, storedFilePath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error("Invalid stored file path");
  }
  return resolved;
}

export function openCourseReadStream(storedFilePath: string) {
  return fs.createReadStream(resolveCourseStoredPath(storedFilePath));
}

export async function statCourseFile(storedFilePath: string) {
  return fs_promises.stat(resolveCourseStoredPath(storedFilePath));
}
