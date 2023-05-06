import { Module } from '@nestjs/common';
import { PlaceLocationsModule } from './place/locations.place.module';
import { UserCustomLocationsModule } from './user/custom/user.locations.custom.module';
import { UserPlaceLocationsModule } from './user/place/user.locations.place.module';

@Module({
  imports: [PlaceLocationsModule, UserCustomLocationsModule, UserPlaceLocationsModule],
  providers: [],
  controllers: [],
})
export class LocationsModule {}
