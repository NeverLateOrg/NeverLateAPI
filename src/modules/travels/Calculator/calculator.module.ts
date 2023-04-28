import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/modules/google/google.module';
import { TravelsCalculatorService } from './calculator.service';

@Module({
  imports: [GoogleModule],
  providers: [TravelsCalculatorService],
  controllers: [],
  exports: [TravelsCalculatorService],
})
export class TravelsCalculatorModule {}
