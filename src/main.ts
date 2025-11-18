import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import type { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(','),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Статичні файли для завантажених матеріалів марафонів
  // Файли з папки "uploads" будуть доступні як http://localhost:4000/uploads/...
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // /healthz для Render
  app.getHttpAdapter().get('/healthz', (req: Request, res: Response): void => {
    res.send({ ok: true });
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
