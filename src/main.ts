/* eslint-disable @typescript-eslint/no-floating-promises */
import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  console.log('Starting Nest Commander...');
  console.log(process.env);
  console.log(process.env.MONGO_URI);
  await CommandFactory.run(AppModule, { logger: new Logger() });
}

bootstrap();
