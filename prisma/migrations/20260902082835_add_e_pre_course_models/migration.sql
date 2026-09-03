-- CreateTable
CREATE TABLE "CourseUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" TEXT,
    "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CourseDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "storedFilePath" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseDocument_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "CourseUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseQuiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timeLimitSeconds" INTEGER NOT NULL,
    "questionsPerAttempt" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseQuiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "CourseQuiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseQuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "timeLimitSecondsSnapshot" INTEGER NOT NULL,
    "questionsSnapshot" TEXT NOT NULL,
    "answers" TEXT,
    "score" INTEGER,
    "totalQuestions" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" DATETIME,
    CONSTRAINT "CourseQuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "CourseQuiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseQuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CourseUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoursePushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoursePushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CourseUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseUser_serviceNumber_key" ON "CourseUser"("serviceNumber");

-- CreateIndex
CREATE INDEX "CourseUser_category_idx" ON "CourseUser"("category");

-- CreateIndex
CREATE INDEX "CourseUser_status_idx" ON "CourseUser"("status");

-- CreateIndex
CREATE INDEX "Course_category_idx" ON "Course"("category");

-- CreateIndex
CREATE INDEX "CourseDocument_courseId_idx" ON "CourseDocument"("courseId");

-- CreateIndex
CREATE INDEX "CourseQuiz_courseId_idx" ON "CourseQuiz"("courseId");

-- CreateIndex
CREATE INDEX "CourseQuestion_quizId_idx" ON "CourseQuestion"("quizId");

-- CreateIndex
CREATE INDEX "CourseQuizAttempt_quizId_idx" ON "CourseQuizAttempt"("quizId");

-- CreateIndex
CREATE INDEX "CourseQuizAttempt_userId_idx" ON "CourseQuizAttempt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePushSubscription_endpoint_key" ON "CoursePushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "CoursePushSubscription_userId_idx" ON "CoursePushSubscription"("userId");
