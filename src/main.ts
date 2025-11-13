import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(','),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // /healthz для Render
  app.getHttpAdapter().get('/healthz', (req, res) => res.send({ ok: true }));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
