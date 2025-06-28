import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const { crm, cpf } = createDoctorDto;

    const existingDoctorByCrm = await this.prisma.doctor.findUnique({
      where: { crm },
    });

    if (existingDoctorByCrm) {
      throw new ConflictException('Médico com este CRM já existe');
    }

    const existingDoctorByCpf = await this.prisma.doctor.findUnique({
      where: { cpf },
    });

    if (existingDoctorByCpf) {
      throw new ConflictException('Médico com este CPF já existe');
    }

    return this.prisma.doctor.create({
      data: createDoctorDto,
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
      include: {
        appointments: {
          include: {
            patient: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Médico não encontrado');
    }

    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    await this.findOne(id);

    if (updateDoctorDto.crm) {
      const existingDoctorByCrm = await this.prisma.doctor.findUnique({
        where: { crm: updateDoctorDto.crm },
      });

      if (existingDoctorByCrm && existingDoctorByCrm.id !== id) {
        throw new ConflictException('Médico com este CRM já existe');
      }
    }

    if (updateDoctorDto.cpf) {
      const existingDoctorByCpf = await this.prisma.doctor.findUnique({
        where: { cpf: updateDoctorDto.cpf },
      });

      if (existingDoctorByCpf && existingDoctorByCpf.id !== id) {
        throw new ConflictException('Médico com este CPF já existe');
      }
    }

    return this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const appointments = await this.prisma.appointment.count({
      where: { doctorId: id },
    });

    if (appointments > 0) {
      throw new BadRequestException(
        'Não é possível excluir um médico que possui consultas agendadas',
      );
    }

    await this.prisma.doctor.delete({
      where: { id },
    });

    return { message: 'Médico removido com sucesso' };
  }

  async getSchedule(id: number) {
    const doctor = await this.findOne(id);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        patient: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return {
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        crm: doctor.crm,
      },
      appointments,
    };
  }
}
