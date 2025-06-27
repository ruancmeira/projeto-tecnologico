import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorDto {
  @ApiProperty({
    description: 'Novo nome completo do médico',
    example: 'Dr. Carlos Pereira Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Novo CPF do médico',
    example: '123.456.789-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
    required: false,
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: 'Nova especialidade médica',
    example: 'Cardiologia Pediátrica',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({
    description: 'Novo número do CRM do médico',
    example: 'CRM/SP 654.321',
    required: false,
  })
  @IsOptional()
  @IsString()
  crm?: string;

  @ApiProperty({
    description: 'Novo endereço completo do médico',
    example: 'Avenida Brasil, 2000 - São Paulo/SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
