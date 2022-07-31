import { AppModule } from './app/AppModule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.listen(8080);
}
bootstrap();
