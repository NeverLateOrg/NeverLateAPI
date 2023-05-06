import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleService } from 'src/modules/google/google.service';
import { User } from 'src/modules/users/schemas/user.schema';
import { PlaceLocationsService } from '../../place/locations.place.service';
import { UserPlaceLocation } from './schemas/user.location.place.schema';
import { UserPlaceLocationsRepository } from './user.locations.place.repository';

@Injectable()
export class UserPlaceLocationsService {
  constructor(
    private readonly userPlaceLocationsRepository: UserPlaceLocationsRepository,
    private readonly placeLocationService: PlaceLocationsService,
    private readonly googleService: GoogleService,
  ) {}

  public async getPlaceLocations(user: User): Promise<UserPlaceLocation[]> {
    const userPlaces = await this.userPlaceLocationsRepository.find({ user });
    await Promise.all(
      userPlaces.map(async (userPlace) => {
        return await userPlace.populate('placeLocation');
      }),
    );
    return userPlaces;
  }

  public async addPlaceLocation(user: User, placeId: string): Promise<UserPlaceLocation> {
    const placeLocation = await this.placeLocationService.getPlaceLocation(placeId);
    if (placeLocation !== null) {
      return await this.userPlaceLocationsRepository.create({ user, placeLocation });
    }

    // check if placeId is a correct placeId
    const place = await this.googleService.getPlace(placeId);
    if (place === null) {
      throw new BadRequestException('Invalid placeId');
    }
    const newPlaceLocation = await this.placeLocationService.createPlaceLocation(placeId, place);
    return await this.userPlaceLocationsRepository.create({ user, placeLocation: newPlaceLocation });
  }

  public async getPlaceLocation(user: User, placeLocationId: string): Promise<UserPlaceLocation> {
    const placeLocation = await this.userPlaceLocationsRepository.findOne({ user, _id: placeLocationId });
    if (placeLocation === null) {
      throw new BadRequestException('Invalid placeLocationId');
    }
    await placeLocation.populate('placeLocation');
    return placeLocation;
  }
}
