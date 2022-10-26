import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("sartajiscool", 10);
  const data = {
    email: "sartaj@mayustudios.com",
    firstName: "Sartaj",
    lastName: "Chowdhury",
    address: "1722 W CARMEN AVE 1 EAST, CHICAGO, IL",
    password: {
      create: {
        hash: hashedPassword,
      },
    },
  };

  // cleanup the existing database
  await prisma.user.delete({ where: { email: data.email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.user.create({ data });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
