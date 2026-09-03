const { createServer } = require("http");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const next = require("next");

const COURSE_ADMIN_SERVICE_NUMBER = "ADMIN";

async function ensureSettingsRow() {
  const prisma = new PrismaClient();
  await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  await prisma.$disconnect();
}

async function ensureCourseAdminSeeded() {
  const password = process.env.COURSE_ADMIN_PASSWORD;
  if (!password) return;
  const name = process.env.COURSE_ADMIN_NAME || "Administrator";

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.courseUser.upsert({
    where: { serviceNumber: COURSE_ADMIN_SERVICE_NUMBER },
    update: {},
    create: { serviceNumber: COURSE_ADMIN_SERVICE_NUMBER, passwordHash, name, role: "ADMIN", status: "APPROVED", category: null },
  });
  await prisma.$disconnect();
}

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(ensureSettingsRow)
  .then(ensureCourseAdminSeeded)
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(process.env.PORT || 3000, () => {
      console.log("Server ready on port", process.env.PORT || 3000);
    });
  });
