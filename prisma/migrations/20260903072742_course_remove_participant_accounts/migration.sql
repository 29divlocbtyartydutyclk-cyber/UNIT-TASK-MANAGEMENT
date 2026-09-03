/*
  Warnings:

  - You are about to drop the `CourseUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `uploadedById` on the `CourseDocument` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CoursePushSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CourseQuizAttempt` table. All the data in the column will be lost.
  - Added the required column `category` to the `CoursePushSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantName` to the `CourseQuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantServiceNumber` to the `CourseQuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseUser_status_idx";

-- DropIndex
DROP INDEX "CourseUser_category_idx";

-- DropIndex
DROP INDEX "CourseUser_serviceNumber_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CourseUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CourseSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "adminPasswordHash" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "storedFilePath" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseDocument_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseDocument" ("courseId", "id", "mimeType", "originalName", "sizeBytes", "storedFilePath", "title", "uploadedAt") SELECT "courseId", "id", "mimeType", "originalName", "sizeBytes", "storedFilePath", "title", "uploadedAt" FROM "CourseDocument";
DROP TABLE "CourseDocument";
ALTER TABLE "new_CourseDocument" RENAME TO "CourseDocument";
CREATE INDEX "CourseDocument_courseId_idx" ON "CourseDocument"("courseId");
CREATE TABLE "new_CoursePushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CoursePushSubscription" ("auth", "createdAt", "endpoint", "id", "p256dh") SELECT "auth", "createdAt", "endpoint", "id", "p256dh" FROM "CoursePushSubscription";
DROP TABLE "CoursePushSubscription";
ALTER TABLE "new_CoursePushSubscription" RENAME TO "CoursePushSubscription";
CREATE UNIQUE INDEX "CoursePushSubscription_endpoint_key" ON "CoursePushSubscription"("endpoint");
CREATE INDEX "CoursePushSubscription_category_idx" ON "CoursePushSubscription"("category");
CREATE TABLE "new_CourseQuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantServiceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "timeLimitSecondsSnapshot" INTEGER NOT NULL,
    "questionsSnapshot" TEXT NOT NULL,
    "answers" TEXT,
    "score" INTEGER,
    "totalQuestions" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" DATETIME,
    CONSTRAINT "CourseQuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "CourseQuiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseQuizAttempt" ("answers", "id", "questionsSnapshot", "quizId", "score", "startedAt", "status", "submittedAt", "timeLimitSecondsSnapshot", "totalQuestions") SELECT "answers", "id", "questionsSnapshot", "quizId", "score", "startedAt", "status", "submittedAt", "timeLimitSecondsSnapshot", "totalQuestions" FROM "CourseQuizAttempt";
DROP TABLE "CourseQuizAttempt";
ALTER TABLE "new_CourseQuizAttempt" RENAME TO "CourseQuizAttempt";
CREATE INDEX "CourseQuizAttempt_quizId_idx" ON "CourseQuizAttempt"("quizId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
