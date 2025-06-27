import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('API de consultas médicas')
    .setDescription(
      'API para gerenciamento de consultas médicas com pacientes e médicos',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('patients', 'Gerenciamento de pacientes')
    .addTag('doctors', 'Gerenciamento de médicos')
    .addTag('appointments', 'Gerenciamento de consultas')
    .addTag('users', 'Gerenciamento de usuários')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customSiteTitle: 'API de consultas médicas - Documentação',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
