import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as momentTimezone from 'moment-timezone';

const logger = new Logger('Main');
const configService = new ConfigService();

async function bootstrap() {

  const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
  const RABBITMQ_PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_URL}`],
      queue: 'admin-backend',
      noAck: false,
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao-Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  await app.listen();
}
bootstrap();
