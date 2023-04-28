import { Command, CommandRunner } from 'nest-commander';
import { PresetService } from 'src/presets/preset.service';

@Command({ name: 'preset', description: 'setup', arguments: '<preset>' })
export class PresetCommand extends CommandRunner {
  constructor(private readonly presetService: PresetService) {
    super();
  }

  public async run(passedParams: string[]): Promise<void> {
    const preset = passedParams[0];
    await this.presetService.apply(preset);
  }
}
