import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  // Disable default body parser so we can set a higher limit for profile pictures
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: '5mb' }));

  // Enable CORS – allow frontend origin
  app.enableCors({
    origin: 'http://localhost:5173',          
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(4000);
  console.log('🚀 Server running on http://localhost:4000');
}

bootstrap();