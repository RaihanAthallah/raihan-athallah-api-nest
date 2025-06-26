import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  // Konfigurasi dasar untuk dokumen Swagger
  const config = new DocumentBuilder()
    .setTitle('Raihan Athallah = Chatbot API')
    .setDescription('Dokumentasi API untuk chatbot yang menggunakan Google GenAI')
    .setVersion('1.0')
    .addTag('Chatbot') // Menambahkan tag untuk mengelompokkan endpoint
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key', // Nama header untuk API key
      },
      'x-api-key', // Nama security scheme
    )
    .build();

  // Membuat dokumen Swagger
  const document = SwaggerModule.createDocument(app, config);
  // Setup Swagger UI
  // Argumen pertama adalah path untuk mengakses UI, contoh: http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ApiKeyGuard(reflector));

  await app.listen(process.env.PORT ?? 8091);
}

bootstrap();
