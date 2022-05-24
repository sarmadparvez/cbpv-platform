/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as contextService from 'request-context';
import { AppModule } from './app/app.module';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from "@nestjs/swagger";
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Task')
    .setDescription(
      'Task service is responsible for iterative validation of Prototypes. Tasks are created and Feedback is provided through this service.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      description: 'Authentication is done by a signed JWT',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // save swagger spec file
  saveSwaggerSpec(document);

  // add global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  // wrap requests in a middleware namespace 'request'.
  // thi is done to attach data to request context e.g currently logged in user
  app.use(contextService.middleware('request'));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

function saveSwaggerSpec(document: OpenAPIObject) {
  const fileName = 'apps/task/src/swagger/swagger.json';
  try {
    fs.writeFileSync(fileName, JSON.stringify(document));
  } catch (error) {
    console.error('Error in saving swagger file', fileName, error);
  }
}

bootstrap();
