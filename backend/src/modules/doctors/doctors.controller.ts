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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('doctors')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'doctors',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiOperation({
    summary: 'Criar novo médico',
    description: 'Cadastra um novo médico no sistema',
  })
  @ApiCreatedResponse({
    description: 'Médico criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Dr. Carlos Pereira' },
        cpf: { type: 'string', example: '987.654.321-00' },
        specialty: { type: 'string', example: 'Cardiologia' },
        crm: { type: 'string', example: 'CRM/SP 123.456' },
        address: {
          type: 'string',
          example: 'Avenida Paulista, 1000 - São Paulo/SP',
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
    description: 'Dados inválidos ou CRM já existe',
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
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiOperation({
    summary: 'Listar todos os médicos',
    description: 'Retorna uma lista com todos os médicos cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de médicos retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Dr. Carlos Pereira' },
          cpf: { type: 'string', example: '987.654.321-00' },
          specialty: { type: 'string', example: 'Cardiologia' },
          crm: { type: 'string', example: 'CRM/SP 123.456' },
          address: {
            type: 'string',
            example: 'Avenida Paulista, 1000 - São Paulo/SP',
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
    return this.doctorsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar médico por ID',
    description: 'Retorna os dados de um médico específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do médico',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Médico encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Dr. Carlos Pereira' },
        cpf: { type: 'string', example: '987.654.321-00' },
        specialty: { type: 'string', example: 'Cardiologia' },
        crm: { type: 'string', example: 'CRM/SP 123.456' },
        address: {
          type: 'string',
          example: 'Avenida Paulista, 1000 - São Paulo/SP',
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
    description: 'Médico não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Doctor not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Obter agenda do médico',
    description: 'Retorna a agenda de consultas de um médico específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do médico',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Agenda do médico retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T00:00:00.000Z',
          },
          time: { type: 'string', example: '14:30' },
          status: {
            type: 'string',
            enum: ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
            example: 'SCHEDULED',
          },
          patientName: { type: 'string', example: 'Maria Santos' },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Médico não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get(':id/schedule')
  getSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.getSchedule(id);
  }

  @ApiOperation({
    summary: 'Atualizar médico',
    description: 'Atualiza os dados de um médico existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do médico',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Médico atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Dr. Carlos Pereira' },
        cpf: { type: 'string', example: '987.654.321-00' },
        specialty: { type: 'string', example: 'Cardiologia' },
        crm: { type: 'string', example: 'CRM/SP 123.456' },
        address: {
          type: 'string',
          example: 'Avenida Paulista, 1000 - São Paulo/SP',
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
    description: 'Médico não encontrado',
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
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @ApiOperation({
    summary: 'Remover médico',
    description: 'Remove um médico do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do médico',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Médico removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Doctor deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Médico não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
