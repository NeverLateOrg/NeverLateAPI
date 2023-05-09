import { Client, PlaceData, Status, TrafficModel, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

interface TravelOption {
  mode: TravelMode;
  arrivalTime: Date;
  arrivalOffsetInMinutes?: number;
}

interface SearchOptions {
  location?: string;
  input: string;
}

interface TravelData {
  duration: number;
  departureTime: Date;
  arrivalTime?: Date;
}

export interface PlaceBasics {
  placeId: string;
  name: string;
  address: string;
}

@Injectable()
export class GoogleService {
  // temp hardcoded (will be change)
  private readonly GOOGLE_API_KEY = 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g';

  constructor(private readonly client: Client) {}

  public async formatLocation(location: string): Promise<{ formattedAddress: string; wasGood: boolean }> {
    let isGood = false;
    try {
      const response = await this.client.geocode({
        params: {
          address: location,
          key: this.GOOGLE_API_KEY,
        },
      });
      if (response.data.status === Status.OK) {
        // The query string was a valid address
        if (response.data.results.length > 0) {
          // we take the first result
          location = response.data.results[0].formatted_address;
          isGood = true;
        }
      }
    } catch (error) {
      return { formattedAddress: location, wasGood: isGood };
    }
    return { formattedAddress: location, wasGood: isGood };
  }

  private async calculateDuration(
    from: string,
    to: string,
    departureTime: Date,
    mode: TravelMode,
  ): Promise<number | null> {
    try {
      const response = await this.client.directions({
        params: {
          origin: from,
          destination: to,
          mode,
          traffic_model: TrafficModel.best_guess,
          units: UnitSystem.metric,
          key: this.GOOGLE_API_KEY,
          departure_time: departureTime.getTime(),
        },
      });
      if (response.data.status === Status.OK) {
        return response.data.routes[0].legs[0].duration.value;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  private async getTransitData(from: string, to: string, arrivalTime: Date): Promise<TravelData | null> {
    try {
      const response = await this.client.directions({
        params: {
          origin: from,
          destination: to,
          mode: TravelMode.transit,
          traffic_model: TrafficModel.best_guess,
          units: UnitSystem.metric,
          key: this.GOOGLE_API_KEY,
          arrival_time: arrivalTime.getTime(),
        },
      });
      if (response.data.status === Status.OK) {
        const leg = response.data.routes[0].legs[0];
        return {
          duration: leg.duration.value,
          arrivalTime: new Date(leg.arrival_time.value),
          departureTime: new Date(leg.departure_time.value),
        };
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  public async calculateTravel(from: string, to: string, option: TravelOption): Promise<TravelData | null> {
    const adjustedArrivalTime = new Date(
      option.arrivalTime.getTime() - (option.arrivalOffsetInMinutes ?? 0) * 60 * 1000,
    );

    let duration: number | null = null;
    let estimatedDepartureTime: Date | null = null;

    if (option.mode === 'transit') {
      const transitData = await this.getTransitData(from, to, adjustedArrivalTime);
      if (transitData === null) {
        return null;
      }
      duration = transitData.duration;
      estimatedDepartureTime = transitData.departureTime;
    } else {
      const estimatedDuration = await this.calculateDuration(from, to, adjustedArrivalTime, option.mode);
      if (estimatedDuration === null) {
        return null;
      }
      estimatedDepartureTime = new Date(adjustedArrivalTime.getTime() - estimatedDuration * 1000);

      do {
        duration = await this.calculateDuration(from, to, estimatedDepartureTime, option.mode);
        if (duration === null) {
          return null;
        }
        const arrivalDate = new Date(estimatedDepartureTime.getTime() + duration * 1000);
        if (arrivalDate.getTime() > adjustedArrivalTime.getTime()) {
          estimatedDepartureTime = new Date(adjustedArrivalTime.getTime() - duration * 1000);
        } else {
          break;
        }
      } while (true);
    }

    return { duration, departureTime: estimatedDepartureTime };
  }

  public async getPlace(placeId: string): Promise<Partial<PlaceData> | null> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.GOOGLE_API_KEY,
        },
      });
      if (response.data.status === Status.OK) {
        return response.data.result;
      }
    } catch (error) {}
    return null;
  }

  public async getPlacePhoto(photoReference: string, maxWidth: number): Promise<Readable | null> {
    try {
      const response = (await this.client.placePhoto({
        params: {
          photoreference: photoReference,
          maxwidth: maxWidth,
          key: this.GOOGLE_API_KEY,
        },
        responseType: 'stream',
      })) as any;
      return response.data;
    } catch (error) {}
    return null;
  }

  public async getMatchingPlaces(options: SearchOptions): Promise<{ nextPageToken?: string; places: PlaceBasics[] }> {
    try {
      const response = await this.client.textSearch({
        params: {
          query: options.input,
          location: options.location ?? '',
          key: this.GOOGLE_API_KEY,
        },
      });
      if (response.data.status === Status.OK) {
        const nextPageToken = response.data.next_page_token;
        let places: PlaceBasics[] = response.data.results.map((result) => ({
          placeId: result.place_id ?? '',
          name: result.name ?? '',
          address: result.formatted_address ?? '',
        }));
        places = places.filter((place) => place.placeId !== '' && place.name !== '' && place.address !== '');
        return { nextPageToken, places };
      }
    } catch (error) {
      console.log(error);
    }
    return { places: [] };
  }

  public async getMatchingPlacesNextPage(
    nextPageToken: string,
  ): Promise<{ nextPageToken?: string; places: PlaceBasics[] }> {
    try {
      const response = await this.client.textSearch({
        params: {
          query: '',
          pagetoken: nextPageToken,
          key: this.GOOGLE_API_KEY,
        },
      });
      if (response.data.status === Status.OK) {
        const nextPageToken = response.data.next_page_token;
        let places: PlaceBasics[] = response.data.results.map((result) => ({
          placeId: result.place_id ?? '',
          name: result.name ?? '',
          address: result.formatted_address ?? '',
        }));
        places = places.filter((place) => place.placeId !== '' && place.name !== '' && place.address !== '');
        return { nextPageToken, places };
      }
    } catch (error) {
      console.log(error.data);
    }
    return { places: [] };
  }
}
