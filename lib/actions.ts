"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from '@/lib/prisma'


export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }

    const cookieStore = await cookies();
    cookieStore.set(
      "session",
      JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email,
      }),
      { httpOnly: true, secure: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  return session ? JSON.parse(session) : null;
}

export async function getSpecialties() {
  // Ahora podemos obtener especialidades únicas de los médicos
  const medics = await prisma.medic.findMany({
    select: {
      specialty: true
    },
    distinct: ['specialty']
  });
  
  return medics.map((m: { specialty: string }) => ({
    id: m.specialty.toLowerCase().replace(/\s+/g, '-'),
    name: m.specialty
  }));
}

export async function getDoctorsBySpecialty(specialtyId: string) {
  // Convertimos el specialtyId de vuelta al formato original (ej: "dermatologia" -> "Dermatología")
  const specialtyName = specialtyId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const doctors = await prisma.medic.findMany({
    where: { 
      specialty: {
        equals: specialtyName,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      specialty: true
    }
  });

  return doctors.map((d: { id: { toString: () => any; }; name: any; specialty: string; }) => ({
    id: d.id.toString(),
    name: d.name,
    specialtyId: d.specialty.toLowerCase().replace(/\s+/g, '-')
  }));
}

export async function generateTimeSlots(medicId: string, date: Date) {
  try {
    // Convertir medicId a número
    const medicIdNum = parseInt(medicId);
    
    // Obtener todas las horas disponibles
    const allHours = await prisma.hours.findMany({
      select: {
        id: true,
        hour: true
      },
      orderBy: {
        hour: 'asc'
      }
    });

    // Obtener citas existentes para este médico en esta fecha
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: { 
        medicId: medicIdNum,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        hourId: true
      }
    });

    // IDs de horas ocupadas
    const bookedHourIds = appointments.map((a: { hourId: any; }) => a.hourId);

    // Filtrar horas disponibles
    const availableSlots = allHours
      .filter((hour: { id: any; }) => !bookedHourIds.includes(hour.id))
      .map((hour: { id: { toString: () => any; }; hour: any; }) => ({
        id: hour.id.toString(),
        time: hour.hour
      }));

    return availableSlots;
  } catch (error) {
    console.error("Error al generar horarios:", error);
    return [];
  }
}

export async function createAppointment(data: {
  specialty: string;
  medicId: string;
  date: Date;
  hourId: string;
}) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      throw new Error("No autenticado");
    }

    // Convertir IDs a números
    const medicIdNum = parseInt(data.medicId);
    const hourIdNum = parseInt(data.hourId);

    // Obtener información del médico
    const medic = await prisma.medic.findUnique({
      where: { id: medicIdNum }
    });

    if (!medic) {
      throw new Error("Médico no encontrado");
    }

    // Obtener información de la hora
    const hour = await prisma.hours.findUnique({
      where: { id: hourIdNum }
    });

    if (!hour) {
      throw new Error("Horario no válido");
    }

    // Crear la cita
    const newAppointment = await prisma.appointment.create({
      data: {
        userId: session.userId,
        medicId: medicIdNum,
        hourId: hourIdNum,
        date: new Date(data.date),
        status: "scheduled"
      },
      include: {
        medic: true,
        hour: true
      }
    });

    revalidatePath("/dashboard");
    return { 
      success: true, 
      appointment: {
        id: newAppointment.id,
        doctorName: newAppointment.medic.name,
        date: newAppointment.date,
        time: newAppointment.hour.hour,
        status: newAppointment.status
      } 
    };
  } catch (error: any) {
    console.error("Error al crear cita:", error);
    return { 
      success: false, 
      message: error.message || "Error al crear la cita" 
    };
  }
}

export async function getUserAppointments() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return [];
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: session.userId },
      include: {
        medic: true,
        hour: true
      },
      orderBy: { 
        date: 'asc',
        hour: {
          hour: 'asc'
        }
      }
    });

    return appointments.map((a: { id: { toString: () => any; }; medic: { name: any; specialty: any; }; date: any; hour: { hour: any; }; status: any; }) => ({
      id: a.id.toString(),
      doctorName: a.medic.name,
      specialty: a.medic.specialty,
      date: a.date,
      time: a.hour.hour,
      status: a.status
    }));
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}

export async function cancelAppointment(appointmentId: string) {
  try {
    // Convertir ID a número
    const idNum = parseInt(appointmentId);

    // 1. Verificar que la cita existe y puede ser cancelada
    const appointment = await prisma.appointment.findUnique({
      where: { id: idNum },
      include: {
        user: true,
        medic: true,
        hour: true
      }
    });

    if (!appointment) {
      throw new Error("Turno no encontrado");
    }

    if (appointment.status === "cancelled") {
      throw new Error("El turno ya fue cancelado anteriormente");
    }

    if (new Date(appointment.date) < new Date()) {
      throw new Error("No se puede cancelar un turno que ya pasó");
    }

    // 2. Actualizar el estado de la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id: idNum },
      data: {
        status: "cancelled",
        updatedAt: new Date()
      },
      include: {
        medic: true,
        hour: true
      }
    });

    return {
      success: true,
      message: "Turno cancelado exitosamente",
      appointment: {
        id: updatedAppointment.id,
        doctorName: updatedAppointment.medic.name,
        date: updatedAppointment.date,
        time: updatedAppointment.hour.hour,
        status: updatedAppointment.status
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al cancelar el turno",
    };
  }
}