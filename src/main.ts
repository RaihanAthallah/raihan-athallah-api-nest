import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Konfigurasi dasar untuk dokumen Swagger
  const config = new DocumentBuilder()
    .setTitle('Raihan Athallah = Chatbot API')
    .setDescription('Dokumentasi API untuk chatbot yang menggunakan Google GenAI')
    .setVersion('1.0')
    .addTag('cats') // Menambahkan tag untuk mengelompokkan endpoint
    .build();

  // Membuat dokumen Swagger
  const document = SwaggerModule.createDocument(app, config);
  // Setup Swagger UI
  // Argumen pertama adalah path untuk mengakses UI, contoh: http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
