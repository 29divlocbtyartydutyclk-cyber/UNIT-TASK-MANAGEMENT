-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT,
    "branch" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "responsiblePerson" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "unitName" TEXT NOT NULL DEFAULT 'Unit',
    "defaultReminder" TEXT NOT NULL DEFAULT 'None',
    "weekStartsOn" TEXT NOT NULL DEFAULT 'Monday',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Task_date_idx" ON "Task"("date");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_branch_idx" ON "Task"("branch");

-- CreateIndex
CREATE INDEX "Task_category_idx" ON "Task"("category");
