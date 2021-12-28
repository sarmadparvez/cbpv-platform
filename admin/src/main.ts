import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Admin')
    .setDescription('Admin service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // save swagger spec file
  saveSwaggerSpec(document);
  await app.listen(3001);
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
