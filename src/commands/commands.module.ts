import { Module } from '@nestjs/common';
import { PresetModule } from 'src/presets/preset.module';
import { PresetCommand } from './preset.command';
import { StartCommand } from './start.command';

@Module({
  imports: [PresetModule],
  providers: [StartCommand, PresetCommand],
  controllers: [],
  exports: [],
})
export class CommandsModule {}
