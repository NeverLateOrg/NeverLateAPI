import { Module } from '@nestjs/common';
import { GoogleModule } from 'src/modules/google/google.module';
import { PresetModule } from 'src/presets/preset.module';
import { PresetCommand } from './preset.command';
import { StartCommand } from './start.command';
import { TestCommand } from './test.command';

@Module({
  imports: [PresetModule, GoogleModule],
  providers: [StartCommand, PresetCommand, TestCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
