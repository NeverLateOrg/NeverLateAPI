import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventSchema } from './schemas/event.schema';
import { EventsService } from './events.service';
import { EventsManagerModule } from '../eventsManager/events.Manager.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), EventsManagerModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
