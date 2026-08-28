const { createServer } = require("http");
const { PrismaClient } = require("@prisma/client");
const next = require("next");

async function ensureSettingsRow() {
  const prisma = new PrismaClient();
  await prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  await prisma.$disconnect();
}

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(ensureSettingsRow)
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(process.env.PORT || 3000, () => {
      console.log("Server ready on port", process.env.PORT || 3000);
    });
  });
