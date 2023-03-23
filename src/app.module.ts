import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './modules/events/events.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:12341234@localhost/neverlate?authSource=admin'),
    UsersModule,
    EventsModule,
  ],
})
export class AppModule {}
