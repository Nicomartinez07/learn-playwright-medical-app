import { PrismaClient } from "@prisma/client";

async function globalSetup() {
  const prisma = new PrismaClient();
  try {
    console.log("Cleaning up test database...");

    await prisma.user.createMany({
      data: [
        {
          name: "Juan Perez",
          email: "example@gmail.com",
          phone: "11 12345678",
          password: "12345678",
        },
      ],
    });
    

    await prisma.medic.createMany({
      data: [
        { name: "Juan Perez", specialty: "Pediatra" },
        { name: "Julia Lopez", specialty: "Cardiologa" },
        { name: "Maria Garcia", specialty: "Dermatologa" },
        { name: "Victor Martinez", specialty: "Ginecologo" },
      ],
    });

    await prisma.hours.createMany({
      data: [
        { hour: "09:00" },
        { hour: "09:30" },
        { hour: "10:00" },
        { hour: "10:30" },
        { hour: "11:00" },
        { hour: "11:30" },
        { hour: "12:00" },
        { hour: "12:30" },
        { hour: "13:00" },
      ],
    });

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error inserting in database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es un script
globalSetup();
