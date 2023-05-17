import { Command, CommandRunner } from 'nest-commander';
import { GoogleService } from 'src/modules/google/google.service';
import { UsersService } from 'src/modules/users/users.service';

@Command({ name: 'test', description: 'test' })
export class TestCommand extends CommandRunner {
  constructor(private readonly googleService: GoogleService, private readonly usersService: UsersService) {
    super();
  }

  public async run(passedParams: string[]): Promise<void> {}
}
