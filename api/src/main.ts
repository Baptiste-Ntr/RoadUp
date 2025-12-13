import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour le développement
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Important pour les cookies de session
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application démarrée sur http://localhost:${port}`);
  console.log(`🔐 Auth endpoints disponibles sur http://localhost:${port}/api/auth`);
}
bootstrap();
