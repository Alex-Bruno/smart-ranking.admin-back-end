import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:PROBk3xcaH0b@54.144.175.54:5672/smartranking'],
      queue: 'admin-backend',
      noAck: false,
    },
  });


  await app.listen();
}
bootstrap();
