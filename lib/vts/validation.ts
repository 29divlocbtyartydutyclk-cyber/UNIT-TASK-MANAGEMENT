import { z } from "zod";
import { VTS_CATEGORIES } from "@/lib/vts/constants";

export const vtsDriverLoginSchema = z.object({
  driverId: z.string().min(1, "Select your name"),
  password: z.string().min(1, "Password is required"),
});

export const vtsAdminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1, "Password is required"),
});

export const vtsChangeAdminPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(200),
});

export const vtsChangeDriverPasswordSchema = z.object({
  newPassword: z.string().min(4, "Password must be at least 4 characters").max(200),
});

export const vtsDriverInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  serviceId: z.string().trim().min(1, "Service ID is required").max(40),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export const vtsVehicleInputSchema = z.object({
  baNumber: z.string().trim().min(1, "BA number is required").max(40),
  category: z.enum(VTS_CATEGORIES, { message: "Category is required" }),
  model: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined)),
  fuelType: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  mileageKmPerLiter: z.coerce.number().positive().optional().nullable(),
  maxSpeedKmh: z.coerce.number().int().positive().optional().nullable(),
});

export const vtsCategoryMileageInputSchema = z.object({
  category: z.enum(VTS_CATEGORIES),
  mileageKmPerLiter: z.coerce.number().positive("Mileage must be positive"),
  maxSpeedKmh: z.coerce.number().int().positive().optional().nullable(),
});

export const vtsStartMovementSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  destination: z.string().trim().min(1, "Destination is required").max(200),
  purpose: z.string().trim().min(1, "Purpose is required").max(200),
  startingOdometerKm: z.coerce.number().nonnegative().optional().nullable(),
  passengers: z.coerce.number().int().nonnegative().optional().nullable(),
  expectedDurationMin: z.coerce.number().int().nonnegative().optional().nullable(),
  remarks: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export const vtsPingSchema = z.object({
  movementId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().nonnegative().optional().nullable(),
  speedKmh: z.number().nonnegative().optional().nullable(),
  heading: z.number().optional().nullable(),
});
