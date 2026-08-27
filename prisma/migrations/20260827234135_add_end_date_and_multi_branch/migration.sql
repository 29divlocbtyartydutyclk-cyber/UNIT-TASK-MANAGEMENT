-- DropIndex
DROP INDEX "Task_branch_idx";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "endDate" DATETIME;
