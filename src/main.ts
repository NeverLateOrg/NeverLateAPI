/* eslint-disable @typescript-eslint/no-floating-promises */
import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  console.log('Starting Nest Commander...');
  await CommandFactory.run(AppModule, { logger: new Logger() });
}

bootstrap();
