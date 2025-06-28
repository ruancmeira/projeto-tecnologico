import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'dashboard',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Obter dados do dashboard',
    description: 'Retorna dados consolidados para o dashboard',
  })
  @ApiOkResponse({
    description: 'Dados do dashboard retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalPatients: { type: 'number', example: 10 },
        totalDoctors: { type: 'number', example: 5 },
        totalAppointments: { type: 'number', example: 25 },
        appointmentsToday: { type: 'number', example: 3 },
        upcomingAppointments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              date: { type: 'string', format: 'date-time' },
              time: { type: 'string', example: '14:30' },
              status: { type: 'string', example: 'SCHEDULED' },
              patient: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Maria Silva' },
                },
              },
              doctor: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Dr. Carlos Alberto' },
                  specialty: { type: 'string', example: 'Cardiologia' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get()
  getDashboard() {
    return this.appointmentsService.getDashboardData();
  }
}
