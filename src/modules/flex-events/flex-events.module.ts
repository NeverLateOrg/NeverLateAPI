import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';
import { GoogleModule } from '../google/google.module';
import { UserPlaceLocationsModule } from '../locations/user/place/user.locations.place.module';
import { UsersModule } from '../users/users.module';
import { FlexEventsController } from './flex-events.controller';
import { FlexEventsRepository } from './flex-events.repository';
import { FlexEventsService } from './flex-events.service';
import { FlexEvent, FlexEventSchema } from './schemas/flex-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FlexEvent.name, schema: FlexEventSchema }]),
    EventsModule,
    GoogleModule,
    UserPlaceLocationsModule,
    UsersModule,
  ],
  providers: [FlexEventsService, FlexEventsRepository],
  controllers: [FlexEventsController],
})
export class FlexEventsModule {}
