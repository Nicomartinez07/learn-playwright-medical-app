import {prisma } from "@/lib/prisma";

async function globalTeardown() {
  try {
    console.log("Cleaning up test database...");
    // Delete all test data from the database
    await prisma.medic.createMany({
      data: [{
        name: "Juan Perez",
        speciallity: "Pediatra",
      },
      {
        name: "Julia Lopez",
        speciallity: "Cardiologa",
      },
      {
        name: "Maria Garcia",
        speciallity: "Dermatologa",
      },
      {
        name: "Victor Martinez",
        speciallity: "Ginecologo",
      }
    ]
    });
    await prisma.hour.createMany({
      data: [{
        hour: "09:00",
      },{
        hour: "09:30",
      },{
        hour: "10:00",
      },{
        hour: "10:30",
      },{
        hour: "11:00",
      },{
        hour: "11:30",
      },{
        hour: "12:00",
      },{
        hour: "12:30",
      },{
        hour: "13:00",
      }]
    });
  }catch (error) {
    console.error("Error cleaning up test database:", error);
  }
}

export default globalTeardown;