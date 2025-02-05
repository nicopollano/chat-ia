import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { PublicGuard } from './common/guard/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { RoleGuard } from './common/guard/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("PiDrive ChatAI")
    .setDescription("Api documentation")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
/*
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );*/

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new PublicGuard(reflector, jwtService));
  app.useGlobalGuards(new RoleGuard(reflector, jwtService));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
