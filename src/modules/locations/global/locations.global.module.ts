import { Module } from '@nestjs/common';
import { LocationsGlobalService } from './locations.global.service';

@Module({
  imports: [],
  providers: [LocationsGlobalService],
  controllers: [],
})
export class LocationsGlobalModule {}
