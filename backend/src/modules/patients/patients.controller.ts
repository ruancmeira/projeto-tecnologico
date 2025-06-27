import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('patients')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'patients',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: 'Criar novo paciente',
    description: 'Cadastra um novo paciente no sistema',
  })
  @ApiCreatedResponse({
    description: 'Paciente criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Maria Santos' },
        cpf: { type: 'string', example: '123.456.789-00' },
        birthDate: {
          type: 'string',
          format: 'date-time',
          example: '1990-05-15T00:00:00.000Z',
        },
        phone: { type: 'string', example: '(11) 99999-9999' },
        email: { type: 'string', example: 'maria.santos@email.com' },
        address: {
          type: 'string',
          example: 'Rua das Flores, 123 - São Paulo/SP',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou email já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @ApiOperation({
    summary: 'Listar todos os pacientes',
    description: 'Retorna uma lista com todos os pacientes cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de pacientes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Maria Santos' },
          cpf: { type: 'string', example: '123.456.789-00' },
          birthDate: {
            type: 'string',
            format: 'date-time',
            example: '1990-05-15T00:00:00.000Z',
          },
          phone: { type: 'string', example: '(11) 99999-9999' },
          email: { type: 'string', example: 'maria.santos@email.com' },
          address: {
            type: 'string',
            example: 'Rua das Flores, 123 - São Paulo/SP',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar paciente por ID',
    description: 'Retorna os dados de um paciente específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paciente encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Maria Santos' },
        cpf: { type: 'string', example: '123.456.789-00' },
        birthDate: {
          type: 'string',
          format: 'date-time',
          example: '1990-05-15T00:00:00.000Z',
        },
        phone: { type: 'string', example: '(11) 99999-9999' },
        email: { type: 'string', example: 'maria.santos@email.com' },
        address: {
          type: 'string',
          example: 'Rua das Flores, 123 - São Paulo/SP',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Patient not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar paciente',
    description: 'Atualiza os dados de um paciente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paciente atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Maria Santos' },
        cpf: { type: 'string', example: '123.456.789-00' },
        birthDate: {
          type: 'string',
          format: 'date-time',
          example: '1990-05-15T00:00:00.000Z',
        },
        phone: { type: 'string', example: '(11) 99999-9999' },
        email: { type: 'string', example: 'maria.santos@email.com' },
        address: {
          type: 'string',
          example: 'Rua das Flores, 123 - São Paulo/SP',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({
    summary: 'Remover paciente',
    description: 'Remove um paciente do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Paciente removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Patient deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
