import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const { email, cpf } = createPatientDto;

    const existingPatientByEmail = await this.prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatientByEmail) {
      throw new ConflictException('Paciente com este email já existe');
    }

    const existingPatientByCpf = await this.prisma.patient.findUnique({
      where: { cpf },
    });

    if (existingPatientByCpf) {
      throw new ConflictException('Paciente com este CPF já existe');
    }

    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        birthDate: new Date(createPatientDto.birthDate),
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        appointments: {
          include: {
            doctor: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    await this.findOne(id);

    const updateData: any = { ...updatePatientDto };

    if (updatePatientDto.birthDate) {
      updateData.birthDate = new Date(updatePatientDto.birthDate);
    }

    if (updatePatientDto.email) {
      const existingPatientByEmail = await this.prisma.patient.findUnique({
        where: { email: updatePatientDto.email },
      });

      if (existingPatientByEmail && existingPatientByEmail.id !== id) {
        throw new ConflictException('Paciente com este email já existe');
      }
    }

    if (updatePatientDto.cpf) {
      const existingPatientByCpf = await this.prisma.patient.findUnique({
        where: { cpf: updatePatientDto.cpf },
      });

      if (existingPatientByCpf && existingPatientByCpf.id !== id) {
        throw new ConflictException('Paciente com este CPF já existe');
      }
    }

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const appointments = await this.prisma.appointment.count({
      where: { patientId: id },
    });

    if (appointments > 0) {
      throw new BadRequestException(
        'Não é possível excluir um paciente que possui consultas agendadas',
      );
    }

    await this.prisma.patient.delete({
      where: { id },
    });

    return { message: 'Paciente removido com sucesso' };
  }
}
