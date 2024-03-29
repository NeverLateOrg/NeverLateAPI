import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CommandsModule } from './commands/commands.module';
import { AuthModule } from './modules/authentification/auth.module';
import { EventsModule } from './modules/events/events.module';
import { FlexEventsModule } from './modules/flex-events/flex-events.module';
import { LocationsModule } from './modules/locations/locations.module';
import { TravelsModule } from './modules/travels/travels.module';
import { UsersModule } from './modules/users/users.module';
import { PresetModule } from './presets/preset.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    AuthModule,
    UsersModule,
    EventsModule,
    TravelsModule,
    PresetModule,
    CommandsModule,
    LocationsModule,
    FlexEventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
