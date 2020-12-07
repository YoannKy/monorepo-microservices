import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

import { ConcertsGatewayModule } from './concerts-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ConcertsGatewayModule);

  const options = new DocumentBuilder()
    .setTitle('Concerts swagger')
    .setDescription('Swagger for concerts endpoint')
    .setVersion('1.0')
    .addTag('Concerts')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.GATEWAY_HTTP_PORT);
}
bootstrap();
