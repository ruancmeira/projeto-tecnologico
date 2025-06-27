import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientDto {
  @ApiProperty({
    description: 'Novo nome completo do paciente',
    example: 'Maria Santos Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Novo CPF do paciente',
    example: '987.654.321-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: 'Nova data de nascimento do paciente',
    example: '1990-05-15',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Novo telefone do paciente',
    example: '(11) 98888-8888',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Novo email do paciente',
    example: 'maria.santos.silva@email.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Novo endereço completo do paciente',
    example: 'Rua das Orquídeas, 456 - São Paulo/SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
