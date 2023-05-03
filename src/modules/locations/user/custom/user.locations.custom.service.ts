import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GoogleService } from 'src/modules/google/google.service';
import { User } from 'src/modules/users/schemas/user.schema';
import { UserCustomLocation } from './schemas/user.location.custom.schema';
import { UserCustomLocationsRepository } from './user.locations.custom.repository';

@Injectable()
export class UserCustomLocationsService {
  constructor(
    private readonly userCustomLocationsRepository: UserCustomLocationsRepository,
    private readonly googleService: GoogleService,
  ) {}

  public async getCustomLocations(user: User): Promise<UserCustomLocation[]> {
    return await this.userCustomLocationsRepository.find({ user });
  }

  public async addCustomLocation(user: User, name: string, location: string): Promise<UserCustomLocation> {
    // Here check the location is valid
    const { formattedAddress, wasGood } = await this.googleService.formatLocation(location);
    if (!wasGood) {
      throw new BadRequestException('Invalid location');
    }
    const customLocation = { name, formattedAddress, user };
    return await this.userCustomLocationsRepository.create(customLocation);
  }

  public async getCustomLocation(user: User, id: string): Promise<UserCustomLocation> {
    const customLocation = await this.userCustomLocationsRepository.findOne({ _id: id, user });
    if (customLocation == null) {
      throw new NotFoundException('Custom location not found');
    }
    return customLocation;
  }

  public async deleteCustomLocation(user: User, id: string): Promise<boolean> {
    // TODO will need to handle the event that use this location
    const success = await this.userCustomLocationsRepository.deleteMany({ _id: id, user });
    return success;
  }

  public async updateCustomLocation(user: User, id: string, name?: string): Promise<UserCustomLocation> {
    const customLocation = await this.userCustomLocationsRepository.findOne({ _id: id, user });
    if (customLocation == null) {
      throw new NotFoundException('Custom location not found');
    }
    customLocation.name = name ?? customLocation.name;
    return await this.userCustomLocationsRepository.save(customLocation);
  }
}
