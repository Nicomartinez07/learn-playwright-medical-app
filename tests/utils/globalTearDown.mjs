import { PrismaClient } from "@prisma/client";

async function globalTeardown() {
  const prisma = new PrismaClient();
  try {
    console.log("Cleaning up test database...");
    // Delete all test data from the database
    await prisma.medic.deleteMany();
    await prisma.user.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.hours.deleteMany();
    console.log("Cleaning complete")
  }catch (error) {
    console.error("Error cleaning up test database:", error);
  }
}

globalTeardown();