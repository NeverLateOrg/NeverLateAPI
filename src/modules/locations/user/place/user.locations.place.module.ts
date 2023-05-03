import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlaceLocation, UserPlaceLocationSchema } from './schemas/user.location.place.schema';
import { UserPlaceLocationsRepository } from './user.locations.place.repository';
import { UserPlaceLocationsService } from './user.locations.place.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserPlaceLocation.name, schema: UserPlaceLocationSchema }])],
  providers: [UserPlaceLocationsRepository, UserPlaceLocationsService],
  controllers: [],
})
export class UserLocationsModule {}
