-- CreateTable
CREATE TABLE "VtsSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "adminPasswordHash" TEXT NOT NULL,
    "driverPasswordHash" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VtsDriver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VtsVehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "model" TEXT,
    "fuelType" TEXT,
    "mileageKmPerLiter" REAL,
    "maxSpeedKmh" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VtsCategoryMileage" (
    "category" TEXT NOT NULL PRIMARY KEY,
    "mileageKmPerLiter" REAL NOT NULL,
    "maxSpeedKmh" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VtsMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverId" TEXT NOT NULL,
    "driverNameSnapshot" TEXT NOT NULL,
    "driverServiceIdSnapshot" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "baNumberSnapshot" TEXT NOT NULL,
    "categorySnapshot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "destination" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "startingOdometerKm" REAL,
    "passengers" INTEGER,
    "expectedDurationMin" INTEGER,
    "remarks" TEXT,
    "mileageUsedKmPerLiter" REAL NOT NULL,
    "maxSpeedKmh" INTEGER,
    "distanceKm" REAL NOT NULL DEFAULT 0,
    "estimatedOilLiters" REAL NOT NULL DEFAULT 0,
    "lastLat" REAL,
    "lastLng" REAL,
    "lastAccuracy" REAL,
    "lastSpeedKmh" REAL,
    "lastHeading" REAL,
    "lastPingAt" DATETIME,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "VtsMovement_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "VtsDriver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VtsMovement_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "VtsVehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VtsRoutePoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movementId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "accuracy" REAL,
    "speedKmh" REAL,
    "heading" REAL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VtsRoutePoint_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "VtsMovement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VtsAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "movementId" TEXT,
    "baNumber" TEXT,
    "driverName" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VtsAlert_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "VtsMovement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VtsDriver_serviceId_key" ON "VtsDriver"("serviceId");

-- CreateIndex
CREATE INDEX "VtsDriver_status_idx" ON "VtsDriver"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VtsVehicle_baNumber_key" ON "VtsVehicle"("baNumber");

-- CreateIndex
CREATE INDEX "VtsVehicle_status_idx" ON "VtsVehicle"("status");

-- CreateIndex
CREATE INDEX "VtsVehicle_category_idx" ON "VtsVehicle"("category");

-- CreateIndex
CREATE INDEX "VtsMovement_status_idx" ON "VtsMovement"("status");

-- CreateIndex
CREATE INDEX "VtsMovement_driverId_idx" ON "VtsMovement"("driverId");

-- CreateIndex
CREATE INDEX "VtsMovement_vehicleId_idx" ON "VtsMovement"("vehicleId");

-- CreateIndex
CREATE INDEX "VtsRoutePoint_movementId_idx" ON "VtsRoutePoint"("movementId");

-- CreateIndex
CREATE INDEX "VtsAlert_createdAt_idx" ON "VtsAlert"("createdAt");

-- CreateIndex
CREATE INDEX "VtsAlert_movementId_idx" ON "VtsAlert"("movementId");
