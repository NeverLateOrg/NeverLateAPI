import { Command, CommandRunner } from 'nest-commander';
import { GoogleService } from 'src/modules/google/google.service';

@Command({ name: 'test', description: 'test' })
export class TestCommand extends CommandRunner {
  constructor(private readonly googleService: GoogleService) {
    super();
  }

  public async run(passedParams: string[]): Promise<void> {
    const ids = await this.googleService.getPlaces('46.147281,1.513397', 300);
    await this.googleService.getPlaceDetails(ids[0]);
  }
}
