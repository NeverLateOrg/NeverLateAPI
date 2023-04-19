import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TravelsStorageModule } from '../travels/Storage/storage.module';
import { UsersModule } from '../users/users.module';
import { EventsManagerController } from './eventsManager.controller';
import { EventsManagerService } from './eventsManager.service';

@Module({
  imports: [UsersModule, EventsModule, TravelsStorageModule],
  providers: [EventsManagerService],
  controllers: [EventsManagerController],
  exports: [EventsManagerService],
})
export class EventsManagerModule {}
