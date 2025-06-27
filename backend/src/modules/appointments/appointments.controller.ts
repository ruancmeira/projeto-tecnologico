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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'appointments',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Criar nova consulta',
    description: 'Agenda uma nova consulta médica',
  })
  @ApiCreatedResponse({
    description: 'Consulta criada com sucesso',
    schema: {
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
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
        patient: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Maria Santos' },
            email: { type: 'string', example: 'maria.santos@email.com' },
          },
        },
        doctor: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Dr. Carlos Pereira' },
            specialty: { type: 'string', example: 'Cardiologia' },
          },
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
    description: 'Dados inválidos ou conflito de horário',
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
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @ApiOperation({
    summary: 'Listar todas as consultas',
    description: 'Retorna uma lista com todas as consultas cadastradas',
  })
  @ApiOkResponse({
    description: 'Lista de consultas retornada com sucesso',
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
          patientId: { type: 'number', example: 1 },
          doctorId: { type: 'number', example: 2 },
          patient: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Maria Santos' },
              email: { type: 'string', example: 'maria.santos@email.com' },
            },
          },
          doctor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Dr. Carlos Pereira' },
              specialty: { type: 'string', example: 'Cardiologia' },
            },
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
    return this.appointmentsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar consulta por ID',
    description: 'Retorna os dados de uma consulta específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta encontrada com sucesso',
    schema: {
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
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
        patient: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Maria Santos' },
            email: { type: 'string', example: 'maria.santos@email.com' },
          },
        },
        doctor: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Dr. Carlos Pereira' },
            specialty: { type: 'string', example: 'Cardiologia' },
          },
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
    description: 'Consulta não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Appointment not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar consulta',
    description: 'Atualiza os dados de uma consulta existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta atualizada com sucesso',
    schema: {
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
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
        patient: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Maria Santos' },
            email: { type: 'string', example: 'maria.santos@email.com' },
          },
        },
        doctor: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Dr. Carlos Pereira' },
            specialty: { type: 'string', example: 'Cardiologia' },
          },
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
    description: 'Consulta não encontrada',
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
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @ApiOperation({
    summary: 'Confirmar consulta',
    description: 'Altera o status da consulta para CONFIRMED',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta confirmada com sucesso',
    schema: {
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
          example: 'CONFIRMED',
        },
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
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
    description: 'Consulta não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Consulta não pode ser confirmada (status inválido)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Cannot confirm this appointment' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Patch(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.confirm(id);
  }

  @ApiOperation({
    summary: 'Cancelar consulta',
    description: 'Altera o status da consulta para CANCELLED',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta cancelada com sucesso',
    schema: {
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
          example: 'CANCELLED',
        },
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
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
    description: 'Consulta não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Consulta não pode ser cancelada (status inválido)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Cannot cancel this appointment' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.cancel(id);
  }

  @ApiOperation({
    summary: 'Finalizar consulta',
    description: 'Altera o status da consulta para COMPLETED',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta finalizada com sucesso',
    schema: {
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
          example: 'COMPLETED',
        },
        patientId: { type: 'number', example: 1 },
        doctorId: { type: 'number', example: 2 },
        patient: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Maria Santos' },
            email: { type: 'string', example: 'maria.santos@email.com' },
          },
        },
        doctor: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Dr. Carlos Pereira' },
            specialty: { type: 'string', example: 'Cardiologia' },
          },
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
    description: 'Consulta não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'Consulta não pode ser finalizada (status inválido)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Cannot complete this appointment',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.complete(id);
  }

  @ApiOperation({
    summary: 'Listar consultas por médico',
    description: 'Retorna todas as consultas de um médico específico',
  })
  @ApiParam({
    name: 'doctorId',
    description: 'ID único do médico',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lista de consultas do médico retornada com sucesso',
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
          patientId: { type: 'number', example: 1 },
          doctorId: { type: 'number', example: 2 },
          patient: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Maria Santos' },
              email: { type: 'string', example: 'maria.santos@email.com' },
            },
          },
          doctor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Dr. Carlos Pereira' },
              specialty: { type: 'string', example: 'Cardiologia' },
            },
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
  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.appointmentsService.findByDoctor(doctorId);
  }

  @ApiOperation({
    summary: 'Listar consultas por paciente',
    description: 'Retorna todas as consultas de um paciente específico',
  })
  @ApiParam({
    name: 'patientId',
    description: 'ID único do paciente',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lista de consultas do paciente retornada com sucesso',
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
          patientId: { type: 'number', example: 1 },
          doctorId: { type: 'number', example: 2 },
          patient: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Maria Santos' },
              email: { type: 'string', example: 'maria.santos@email.com' },
            },
          },
          doctor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Dr. Carlos Pereira' },
              specialty: { type: 'string', example: 'Cardiologia' },
            },
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
  @Get('patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.appointmentsService.findByPatient(patientId);
  }

  @ApiOperation({
    summary: 'Remover consulta',
    description: 'Remove uma consulta do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da consulta',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Consulta removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Appointment deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Consulta não encontrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
