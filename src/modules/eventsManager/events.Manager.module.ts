import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { EventsManagerController } from './eventsManager.controller';
import { EventsManagerService } from './eventsManager.service';

@Module({
  imports: [UsersModule, EventsModule],
  providers: [EventsManagerService],
  controllers: [EventsManagerController],
})
export class EventsManagerModule {}
