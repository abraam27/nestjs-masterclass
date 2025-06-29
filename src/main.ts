import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app);

  //use global interceptors
  app.listen(3000);
  Logger.log('Server running on port ' + 3000);
}
bootstrap();
