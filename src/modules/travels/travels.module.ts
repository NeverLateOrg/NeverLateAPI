import { Module } from '@nestjs/common';
import { TravelsCalculatorModule } from './Calculator/calculator.module';
import { TravelsStorageModule } from './Storage/storage.module';

@Module({
  imports: [TravelsCalculatorModule, TravelsStorageModule],
  providers: [],
  controllers: [],
})
export class TravelsModule {}
