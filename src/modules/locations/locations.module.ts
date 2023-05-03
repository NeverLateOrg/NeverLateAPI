import { Module } from '@nestjs/common';
import { UserCustomLocationsModule } from './user/custom/user.locations.custom.module';

@Module({
  imports: [UserCustomLocationsModule],
  providers: [],
  controllers: [],
})
export class LocationsModule {}
