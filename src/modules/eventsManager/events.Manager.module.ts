import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TravelsStorageModule } from '../travels/Storage/storage.module';
import { UsersModule } from '../users/users.module';
import { EventsManagerController } from './eventsManager.controller';
import { EventsManagerService } from './eventsManager.service';
import { ValidateEventIdMiddleware } from './middleware/validateEventId.middleware';

@Module({
  imports: [UsersModule, EventsModule, TravelsStorageModule],
  providers: [EventsManagerService],
  controllers: [EventsManagerController],
  exports: [],
})
export class EventsManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ValidateEventIdMiddleware).forRoutes('events/:eventId');
  }
}
