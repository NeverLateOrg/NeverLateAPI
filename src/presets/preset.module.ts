import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/authentification/auth.module';
import { EventsModule } from 'src/modules/events/events.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PresetService } from './preset.service';

@Module({
  imports: [UsersModule, AuthModule, EventsModule],
  providers: [PresetService],
  controllers: [],
  exports: [PresetService],
})
export class PresetModule {}
