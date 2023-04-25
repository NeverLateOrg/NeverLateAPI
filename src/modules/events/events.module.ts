import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationValidatorModule } from '../travels/locationFormator/formator.module';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), LocationValidatorModule],
  providers: [EventsRepository, EventsService],
  controllers: [EventsController],
  exports: [EventsRepository],
})
export class EventsModule {}
