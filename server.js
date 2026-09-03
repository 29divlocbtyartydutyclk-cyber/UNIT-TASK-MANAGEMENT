const { createServer } = require("http");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const next = require("next");

async function ensureSettingsRow() {
  const prisma = new PrismaClient();
  await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  await prisma.$disconnect();
}

async function ensureCourseAdminSeeded() {
  const password = process.env.COURSE_ADMIN_PASSWORD;
  if (!password) return;

  const prisma = new PrismaClient();
  const existing = await prisma.courseSettings.findUnique({ where: { id: 1 } });
  if (!existing) {
    const adminPasswordHash = await bcrypt.hash(password, 10);
    await prisma.courseSettings.create({ data: { id: 1, adminPasswordHash } });
  }
  await prisma.$disconnect();
}

async function ensureVtsSettingsSeeded() {
  const adminPassword = process.env.VTS_ADMIN_PASSWORD;
  const driverPassword = process.env.VTS_DRIVER_PASSWORD;
  if (!adminPassword || !driverPassword) return;

  const prisma = new PrismaClient();
  const existing = await prisma.vtsSettings.findUnique({ where: { id: 1 } });
  if (!existing) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const driverPasswordHash = await bcrypt.hash(driverPassword, 10);
    await prisma.vtsSettings.create({ data: { id: 1, adminPasswordHash, driverPasswordHash } });
  }
  await prisma.$disconnect();
}

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(ensureSettingsRow)
  .then(ensureCourseAdminSeeded)
  .then(ensureVtsSettingsSeeded)
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(process.env.PORT || 3000, () => {
      console.log("Server ready on port", process.env.PORT || 3000);
    });
  });
