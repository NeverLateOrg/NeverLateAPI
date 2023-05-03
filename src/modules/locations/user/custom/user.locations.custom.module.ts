import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleModule } from 'src/modules/google/google.module';
import { UserCustomLocation, UserCustomLocationSchema } from './schemas/user.location.custom.schema';
import { UserCustomLocationsRepository } from './user.locations.custom.repository';
import { UserCustomLocationsService } from './user.locations.custom.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserCustomLocation.name, schema: UserCustomLocationSchema }]),
    GoogleModule,
  ],
  providers: [UserCustomLocationsRepository, UserCustomLocationsService],
  controllers: [],
})
export class LocationsCustomModule {}
