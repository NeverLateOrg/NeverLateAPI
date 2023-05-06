import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceLocationRepository } from './locations.place.repository';
import { PlaceLocationsService } from './locations.place.service';
import { PlaceLocation, PlaceLocationSchema } from './schemas/location.place.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PlaceLocation.name, schema: PlaceLocationSchema }])],
  providers: [PlaceLocationRepository, PlaceLocationsService],
  controllers: [],
  exports: [PlaceLocationsService],
})
export class PlaceLocationsModule {}
