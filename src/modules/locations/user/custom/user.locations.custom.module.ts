import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCustomLocation, UserCustomLocationSchema } from './schemas/user.location.custom.schema';
import { UserCustomLocationsRepository } from './user.locations.custom.repository';
import { UserCustomLocationsService } from './user.locations.custom.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserCustomLocation.name, schema: UserCustomLocationSchema }])],
  providers: [UserCustomLocationsRepository, UserCustomLocationsService],
  controllers: [],
})
export class LocationsCustomModule {}
