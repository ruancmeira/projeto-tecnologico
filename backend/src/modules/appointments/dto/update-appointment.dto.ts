import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Nova data da consulta',
    example: '2024-01-15',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Novo horário da consulta',
    example: '14:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    required: false,
  })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({
    description: 'Novo ID do paciente',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  patientId?: number;

  @ApiProperty({
    description: 'Novo ID do médico',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @ApiProperty({
    description: 'Novo status da consulta',
    enum: AppointmentStatus,
    example: 'CONFIRMED',
    required: false,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
