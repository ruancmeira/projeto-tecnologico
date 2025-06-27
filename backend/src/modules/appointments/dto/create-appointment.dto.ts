import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Data da consulta',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Horário da consulta',
    example: '14:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({
    description: 'ID do paciente',
    example: 1,
  })
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({
    description: 'ID do médico',
    example: 2,
  })
  @IsNotEmpty()
  doctorId: number;
}
