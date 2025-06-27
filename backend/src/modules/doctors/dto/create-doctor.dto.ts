import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Nome completo do médico',
    example: 'Dr. Carlos Pereira',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CPF do médico',
    example: '987.654.321-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'Especialidade médica',
    example: 'Cardiologia',
  })
  @IsNotEmpty()
  @IsString()
  specialty: string;

  @ApiProperty({
    description: 'Número do CRM do médico',
    example: 'CRM/SP 123.456',
  })
  @IsNotEmpty()
  @IsString()
  crm: string;

  @ApiProperty({
    description: 'Endereço completo do médico',
    example: 'Avenida Paulista, 1000 - São Paulo/SP',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
