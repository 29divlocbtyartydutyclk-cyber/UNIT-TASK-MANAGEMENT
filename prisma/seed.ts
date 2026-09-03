import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedCourseAdmin() {
  const password = process.env.COURSE_ADMIN_PASSWORD;
  if (!password) return;

  const existing = await prisma.courseSettings.findUnique({ where: { id: 1 } });
  if (existing) return;

  const adminPasswordHash = await bcrypt.hash(password, 10);
  await prisma.courseSettings.create({ data: { id: 1, adminPasswordHash } });
}

async function seedVtsSettings() {
  const adminPassword = process.env.VTS_ADMIN_PASSWORD;
  const driverPassword = process.env.VTS_DRIVER_PASSWORD;
  if (!adminPassword || !driverPassword) return;

  const existing = await prisma.vtsSettings.findUnique({ where: { id: 1 } });
  if (existing) return;

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const driverPasswordHash = await bcrypt.hash(driverPassword, 10);
  await prisma.vtsSettings.create({ data: { id: 1, adminPasswordHash, driverPasswordHash } });
}

function daysFromToday(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await seedCourseAdmin();
  await seedVtsSettings();

  await prisma.task.deleteMany({});

  await prisma.task.createMany({
    data: [
      {
        title: "Morning PT Session",
        date: daysFromToday(0),
        time: "06:00",
        branches: "A Branch",
        category: "Sports",
        responsiblePerson: "Hav. Sharma",
        priority: "High",
        status: "Pending",
      },
      {
        title: "Weekly Stores Audit",
        date: daysFromToday(0),
        time: "10:00",
        branches: "Q Branch",
        category: "Administrative",
        responsiblePerson: "Sub. Iyer",
        priority: "Normal",
        status: "In Progress",
      },
      {
        title: "Signals Refresher Training",
        date: daysFromToday(0),
        branches: "G Branch",
        category: "Training",
        responsiblePerson: "Capt. Verma",
        priority: "Normal",
        status: "Completed",
      },
      {
        title: "Vehicle Maintenance Check",
        date: daysFromToday(-2),
        branches: "G Branch",
        category: "Administrative",
        responsiblePerson: "Nb Sub. Rao",
        priority: "High",
        status: "Pending",
        remarks: "Overdue - reschedule with workshop",
      },
      {
        title: "Monthly Inventory Reconciliation",
        date: daysFromToday(-3),
        branches: "A Branch",
        category: "Other",
        priority: "Low",
        status: "Completed",
      },
      {
        title: "Inter-Branch Volleyball Tournament",
        date: daysFromToday(2),
        endDate: daysFromToday(16),
        time: "16:30",
        branches: "A Branch,Q Branch,G Branch",
        category: "Sports",
        responsiblePerson: "Lt. Menon",
        priority: "Normal",
        status: "Pending",
        remarks: "Multi-day inter-branch tournament, runs for two weeks",
      },
      {
        title: "First Aid Refresher",
        date: daysFromToday(2),
        branches: "G Branch",
        category: "Training",
        responsiblePerson: "Capt. Verma",
        priority: "High",
        status: "Pending",
      },
      {
        title: "Unit Welfare Meeting",
        date: daysFromToday(5),
        time: "11:00",
        branches: "A Branch,Q Branch",
        category: "Administrative",
        priority: "Low",
        status: "Pending",
      },
      {
        title: "Annual Records Update",
        date: daysFromToday(10),
        branches: "Q Branch",
        category: "Other",
        responsiblePerson: "Sub. Iyer",
        priority: "Normal",
        status: "Pending",
        remarks: "Beyond the 7-day window - not shown on dashboard upcoming list",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
