import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors();
  app.setGlobalPrefix('api/v1')
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  const config = new DocumentBuilder()
    .setTitle('Sneaker Shop Backend API')
    .setDescription('API documentation for Sneaker Backend project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1/docs', app, documentFactory)
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
