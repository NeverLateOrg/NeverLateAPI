import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationValidatorModule } from '../travels/locationFormator/formator.module';
import { EventSchema } from './event.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), LocationValidatorModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
