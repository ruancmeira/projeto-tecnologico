import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { patientId, doctorId, date, time } = createAppointmentDto;

    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        time,
      },
    });

    if (existingAppointment) {
      throw new ConflictException(
        'Doctor already has an appointment at this date and time',
      );
    }

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        date: new Date(date),
      },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findOne(id);

    const updateData: any = { ...updateAppointmentDto };

    if (updateAppointmentDto.date) {
      updateData.date = new Date(updateAppointmentDto.date);
    }
    if (
      updateAppointmentDto.date ||
      updateAppointmentDto.time ||
      updateAppointmentDto.doctorId
    ) {
      const { doctorId, date, time } = updateAppointmentDto;
      const existingAppointment = await this.prisma.appointment.findFirst({
        where: {
          AND: [
            doctorId ? { doctorId } : {},
            date ? { date: new Date(date) } : {},
            time ? { time } : {},
            {
              id: {
                not: id,
              },
            },
          ],
        },
      });

      if (existingAppointment) {
        throw new ConflictException(
          'Doctor already has an appointment at this date and time',
        );
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Appointment deleted successfully' };
  }

  async findByDoctor(doctorId: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }

  async findByPatient(patientId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }

  async confirm(id: number) {
    return this.update(id, { status: $Enums.AppointmentStatus.CONFIRMED });
  }

  async cancel(id: number) {
    return this.update(id, { status: $Enums.AppointmentStatus.CANCELLED });
  }

  async complete(id: number) {
    return this.update(id, { status: $Enums.AppointmentStatus.COMPLETED });
  }
}
