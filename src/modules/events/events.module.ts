import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleModule } from '../google/google.module';
import { TravelsStorageModule } from '../travels/Storage/storage.module';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), TravelsStorageModule, GoogleModule],
  providers: [EventsRepository, EventsService],
  controllers: [EventsController],
  exports: [EventsRepository, EventsService],
})
export class EventsModule {}
