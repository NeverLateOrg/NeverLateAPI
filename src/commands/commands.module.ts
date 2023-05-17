import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/modules/google/google.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PresetModule } from 'src/presets/preset.module';
import { PresetCommand } from './preset.command';
import { StartCommand } from './start.command';
import { TestCommand } from './test.command';

@Module({
  imports: [PresetModule, GoogleModule, UsersModule],
  providers: [StartCommand, PresetCommand, TestCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
