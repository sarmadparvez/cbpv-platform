import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as contextService from 'request-context';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // hot reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
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
  await app.listen(process.env.PORT || 3000);
}

function saveSwaggerSpec(document: OpenAPIObject) {
  const fileName = './swagger/swagger.json';
  try {
    fs.writeFileSync(fileName, JSON.stringify(document));
  } catch (error) {
    console.error('Error in saving swagger file', fileName, error);
  }
}

bootstrap();
