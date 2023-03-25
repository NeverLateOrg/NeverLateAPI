import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { EventsService } from '../events/events.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';
import { EventsManagerController } from './eventsManager.controller';
import { EventsManagerService } from './eventsManager.service';

@Module({
  imports: [UsersModule, EventsModule],
  providers: [EventsManagerService, EventsService, UsersService],
  controllers: [EventsManagerController],
  exports: [CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO],
})
export class EventsManagerModule {}
