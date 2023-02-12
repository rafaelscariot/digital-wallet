import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Digital Wallet Microservice')
    .setDescription(
      'A backend for a digital wallet where you can deposit and withdraw amounts, make and cancel purchases and receive chargebacks',
    )
    .setVersion('1.0')
    .addTag('wallet')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
