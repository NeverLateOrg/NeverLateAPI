import { Module } from '@nestjs/common';
import { TravelsCalculatorService } from './calculator.service';

@Module({
  imports: [],
  providers: [TravelsCalculatorService],
  controllers: [],
  exports: [TravelsCalculatorService],
})
export class TravelsCalculatorModule {}
