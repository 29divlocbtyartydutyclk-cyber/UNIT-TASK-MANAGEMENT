-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "unitName" TEXT NOT NULL DEFAULT 'Unit',
    "defaultReminder" TEXT NOT NULL DEFAULT 'None',
    "weekStartsOn" TEXT NOT NULL DEFAULT 'Monday',
    "adminPasswordHash" TEXT NOT NULL DEFAULT '$2b$10$sqf9dgEam1i01I5JPYNcNOW2bRIjDKOUCGCqB1JkhwrwxND.GWqnS',
    "clerkPasswordHash" TEXT NOT NULL DEFAULT '$2b$10$2IhIaIU1pxbHvQtwABOpfeLF7FWfrLKawREUmoX6lgDU3X740fz1q',
    "viewerPasswordHash" TEXT NOT NULL DEFAULT '$2b$10$IKxCowPAKDKdereqMV/qM.Do7QPv6cI7Ovw64AQUVMzi.XzdXkGWW',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("defaultReminder", "id", "unitName", "updatedAt", "weekStartsOn") SELECT "defaultReminder", "id", "unitName", "updatedAt", "weekStartsOn" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
