import {prisma } from "@/lib/prisma";

async function globalTeardown() {
  try {
    console.log("Cleaning up test database...");
    // Delete all test data from the database
    await prisma.medic.deleteMany();
    await prisma.user.deleteMany();
    await prisma.appointments.deleteMany();
    await prisma.hour.deleteMany();
  }catch (error) {
    console.error("Error cleaning up test database:", error);
  }
}

export default globalTeardown;