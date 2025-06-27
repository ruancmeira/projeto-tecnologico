import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista com todos os usuários cadastrados',
  })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao.silva@email.com' },
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
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Obter dados do usuário logado',
    description: 'Retorna os dados do usuário autenticado (próprio perfil)',
  })
  @ApiOkResponse({
    description: 'Dados do usuário retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
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
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get('me')
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
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
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar próprio perfil',
    description: 'Atualiza os dados do usuário autenticado',
  })
  @ApiOkResponse({
    description: 'Perfil atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
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
  @Patch('me')
  updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Atualizar usuário por ID',
    description: 'Atualiza os dados de um usuário específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
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
    description: 'Usuário não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou email já existe',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou não fornecido',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
