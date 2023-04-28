import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/authentification/auth.module';
import { EventsManagerModule } from 'src/modules/eventsManager/events.Manager.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PresetService } from './preset.service';

@Module({
  imports: [EventsManagerModule, UsersModule, AuthModule],
  providers: [PresetService],
  controllers: [],
  exports: [PresetService],
})
export class PresetModule {}
