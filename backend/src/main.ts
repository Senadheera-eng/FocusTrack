import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS – allow frontend origin
  app.enableCors({
    origin: 'http://localhost:5173',          
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Optional: allow all origins during dev (less secure, but useful for testing)
  // app.enableCors();   // ← uncomment this line instead if want to allow everything

  await app.listen(4000);
}
bootstrap();