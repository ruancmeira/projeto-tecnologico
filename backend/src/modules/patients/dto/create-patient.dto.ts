import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'Maria Santos',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CPF do paciente',
    example: '123.456.789-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'Data de nascimento do paciente',
    example: '1990-05-15',
    format: 'date',
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    description: 'Telefone do paciente',
    example: '(11) 99999-9999',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'maria.santos@email.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Endereço completo do paciente',
    example: 'Rua das Flores, 123 - São Paulo/SP',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
