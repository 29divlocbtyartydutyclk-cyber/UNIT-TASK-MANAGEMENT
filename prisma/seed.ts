import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  await prisma.task.deleteMany({});

  await prisma.task.createMany({
    data: [
      {
        title: "Morning PT Session",
        date: daysFromToday(0),
        time: "06:00",
        branch: "A Branch",
        category: "Sports",
        responsiblePerson: "Hav. Sharma",
        priority: "High",
        status: "Pending",
      },
      {
        title: "Weekly Stores Audit",
        date: daysFromToday(0),
        time: "10:00",
        branch: "Q Branch",
        category: "Administrative",
        responsiblePerson: "Sub. Iyer",
        priority: "Normal",
        status: "In Progress",
      },
      {
        title: "Signals Refresher Training",
        date: daysFromToday(0),
        branch: "G Branch",
        category: "Training",
        responsiblePerson: "Capt. Verma",
        priority: "Normal",
        status: "Completed",
      },
      {
        title: "Vehicle Maintenance Check",
        date: daysFromToday(-2),
        branch: "G Branch",
        category: "Administrative",
        responsiblePerson: "Nb Sub. Rao",
        priority: "High",
        status: "Pending",
        remarks: "Overdue - reschedule with workshop",
      },
      {
        title: "Monthly Inventory Reconciliation",
        date: daysFromToday(-3),
        branch: "A Branch",
        category: "Other",
        priority: "Low",
        status: "Completed",
      },
      {
        title: "Inter-Branch Volleyball Match",
        date: daysFromToday(2),
        time: "16:30",
        branch: "Q Branch",
        category: "Sports",
        responsiblePerson: "Lt. Menon",
        priority: "Normal",
        status: "Pending",
      },
      {
        title: "First Aid Refresher",
        date: daysFromToday(2),
        branch: "G Branch",
        category: "Training",
        responsiblePerson: "Capt. Verma",
        priority: "High",
        status: "Pending",
      },
      {
        title: "Unit Welfare Meeting",
        date: daysFromToday(5),
        time: "11:00",
        branch: "A Branch",
        category: "Administrative",
        priority: "Low",
        status: "Pending",
      },
      {
        title: "Annual Records Update",
        date: daysFromToday(10),
        branch: "Q Branch",
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
