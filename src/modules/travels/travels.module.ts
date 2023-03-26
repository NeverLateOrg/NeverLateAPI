import { Module } from '@nestjs/common';
import { TravelsCalculatorModule } from './Calculator/calculator.module';
import { LocationValidatorModule } from './locationFormator/formator.module';
import { TravelsStorageModule } from './Storage/storage.module';

@Module({
  imports: [TravelsCalculatorModule, TravelsStorageModule, LocationValidatorModule],
  providers: [],
  controllers: [],
})
export class TravelsModule {}
