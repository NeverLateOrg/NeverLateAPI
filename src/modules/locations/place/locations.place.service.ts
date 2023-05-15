import { PlaceData } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { PlaceLocationRepository } from './locations.place.repository';
import { PlaceLocation } from './schemas/location.place.schema';

@Injectable()
export class PlaceLocationsService {
  constructor(private readonly placeLocationsRepository: PlaceLocationRepository) {}

  public async getPlaceLocation(placeId: string): Promise<PlaceLocation | null> {
    return await this.placeLocationsRepository.findOne({ placeId });
  }

  public async createPlaceLocation(placeId: string, place: Partial<PlaceData>): Promise<PlaceLocation> {
    const imageRef = place.photos?.[0]?.photo_reference;
    return await this.placeLocationsRepository.create({
      placeId,
      name: place.name,
      location: place.formatted_address,
      opening_hours: place.opening_hours,
      imageRef,
    });
  }
}
