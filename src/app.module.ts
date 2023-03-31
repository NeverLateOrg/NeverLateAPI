import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/authentification/auth.module';
import { EventsModule } from './modules/events/events.module';
import { EventsManagerModule } from './modules/eventsManager/events.Manager.module';
import { TravelsModule } from './modules/travels/travels.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:12341234@localhost/neverlate?authSource=admin'),
    AuthModule,
    UsersModule,
    EventsModule,
    TravelsModule,
    EventsManagerModule,
  ],
})
export class AppModule {}
