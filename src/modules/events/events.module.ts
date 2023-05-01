import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleModule } from '../google/google.module';
import { TravelsStorageModule } from '../travels/Storage/storage.module';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { TravelsStorageService } from '../travels/Storage/storage.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), TravelsStorageModule, GoogleModule],
  providers: [EventsRepository, EventsService, TravelsStorageService],
  controllers: [EventsController],
  exports: [EventsRepository, EventsService, TravelsStorageService],
})
export class EventsModule {}
