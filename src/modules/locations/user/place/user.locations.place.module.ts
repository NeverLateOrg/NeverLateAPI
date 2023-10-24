import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleModule } from 'src/modules/google/google.module';
import { PlaceLocationsModule } from '../../place/locations.place.module';
import { UserPlaceLocation, UserPlaceLocationSchema } from './schemas/user.location.place.schema';
import { UserPlaceLocationsController } from './user.locations.controller';
import { UserPlaceLocationsRepository } from './user.locations.place.repository';
import { UserPlaceLocationsService } from './user.locations.place.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserPlaceLocation.name, schema: UserPlaceLocationSchema }]),
    PlaceLocationsModule,
    GoogleModule,
  ],
  providers: [UserPlaceLocationsRepository, UserPlaceLocationsService],
  controllers: [UserPlaceLocationsController],
  exports: [UserPlaceLocationsService],
})
export class UserPlaceLocationsModule {}
