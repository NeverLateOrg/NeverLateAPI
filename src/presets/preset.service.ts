import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Connection } from 'mongoose';
import * as path from 'path';
import { AuthService } from 'src/modules/authentification/auth.service';
import { EventsService } from 'src/modules/events/events.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PresetService {
  private readonly logger = new Logger(PresetService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authService: AuthService,
    private readonly eventService: EventsService,
    private readonly userService: UsersService,
  ) {}

  private readonly dirPath: string = path.resolve('presets');

  private getPresetFiles(): string[] {
    const files = fs.readdirSync(this.dirPath);
    return files.map((file) => file.replace('.json', ''));
  }

  private loadPreset(preset: string): any {
    const jsonFilePath = path.join(this.dirPath, `${preset}.json`);
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const modelsData = JSON.parse(jsonData);
    return modelsData;
  }

  private containsPreset(preset: string): boolean {
    return this.getPresetFiles().includes(preset);
  }

  private async clear(): Promise<void> {
    this.logger.log('Clearing database');
    const modelNames = this.connection.modelNames();
    for (const modelName of modelNames) {
      const Model = this.connection.model(modelName);
      await Model.deleteMany({});
    }
  }

  public async apply(preset: string): Promise<void> {
    if (!this.containsPreset(preset)) {
      throw new Error(`Preset ${preset} does not exist`);
    }
    this.logger.log(`Applying preset ${preset}`);
    await this.clear();
    const data = this.loadPreset(preset);

    if (data.users !== undefined) {
      for (const user of data.users) {
        await this.authService.register(user);
      }
    }

    if (data.events !== undefined) {
      for (const event of data.events) {
        const user = await this.userService.getUserFromMail(event.userMail);
        if (user === null) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`User ${event.userMail} does not exist`);
        }
        await this.eventService.createEvent(user, event);
      }
    }
    this.logger.log(`Preset ${preset} applied`);
  }
}
