import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Concerts');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MONGO_HOST_CONCERTS,
        port: +process.env.MICROSERVICE_PORT_CONCERTS,
      },
    },
  );

  await app.listen(() => {
    logger.log('Microservice concerts has started');
  });
}
bootstrap();
