import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const STORES = ["SUGBABS", "ROUXSTER", "EGOY", "VINS", "GMD"];

async function main() {
  const adminPw = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-Admin-123", 10);
  const storePw = await bcrypt.hash(process.env.SEED_STORE_PASSWORD ?? "ChangeMe-Store-123", 10);

  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? "admin@grandmfarena.ph" },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@grandmfarena.ph",
      name: "Grand MF Arena Office",
      passwordHash: adminPw,
      role: "ADMIN",
    },
  });

  for (const code of STORES) {
    const store = await prisma.store.upsert({
      where: { code },
      update: {},
      create: { code, name: code },
    });
    await prisma.user.upsert({
      where: { email: `${code.toLowerCase()}@grandmfarena.ph` },
      update: {},
      create: {
        email: `${code.toLowerCase()}@grandmfarena.ph`,
        name: `${code} Store`,
        passwordHash: storePw,
        role: "STORE",
        storeId: store.id,
      },
    });
  }

  for (const name of ["Beverages", "Snacks", "Food", "Merchandise"]) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  const existing = await prisma.event.count();
  if (existing === 0) {
    await prisma.event.create({
      data: { name: "Grand MF Arena Concert", eventDate: new Date("2026-09-26"), description: "September 2026" },
    });
  }
  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());
