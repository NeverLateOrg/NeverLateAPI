import { Module } from '@nestjs/common';
import { LocationValidatorService } from './formator.service';

@Module({
  imports: [],
  providers: [LocationValidatorService],
  controllers: [],
  exports: [LocationValidatorService],
})
export class LocationValidatorModule {}
