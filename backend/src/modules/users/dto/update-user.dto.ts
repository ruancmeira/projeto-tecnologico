import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Novo nome completo do usuário',
    example: 'João Silva Santos',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Novo email do usuário',
    example: 'joao.silva.santos@email.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'novaSenha123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
