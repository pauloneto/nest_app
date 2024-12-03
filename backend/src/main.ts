import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativar CORS para todos os domínios (se for para produção, especifique a origem)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://0.0.0.0:3000'],  // Aqui você define o endereço do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
