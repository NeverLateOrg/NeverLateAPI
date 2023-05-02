import { Client, Status, TrafficModel, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';

interface TravelOption {
  mode: TravelMode;
  arrivalTime: Date;
  arrivalOffsetInMinutes?: number;
}

interface TravelData {
  duration: number;
  departureTime: Date;
}

@Injectable()
export class GoogleService {
  // temp hardcoded (will be change)
  private readonly GOOGLE_API_KEY = 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g';

  constructor(private readonly client: Client) {}

  public async formatLocation(location: string): Promise<string> {
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
        }
      }
    } catch (error) {
      return location;
    }
    return location;
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

  public async calculateTravel(from: string, to: string, option: TravelOption): Promise<TravelData | null> {
    const adjustedArrivalTime = new Date(
      option.arrivalTime.getTime() - (option.arrivalOffsetInMinutes ?? 0) * 60 * 1000,
    );
    const estimatedDuration = await this.calculateDuration(from, to, adjustedArrivalTime, option.mode);
    if (estimatedDuration === null) {
      return null;
    }
    let estimatedDepartureTime = new Date(adjustedArrivalTime.getTime() - estimatedDuration * 1000);

    let duration: number | null;
    let arrivalDate: Date;
    do {
      duration = await this.calculateDuration(from, to, estimatedDepartureTime, option.mode);
      if (duration === null) {
        return null;
      }
      arrivalDate = new Date(estimatedDepartureTime.getTime() + duration * 1000);
      if (arrivalDate.getTime() > adjustedArrivalTime.getTime()) {
        estimatedDepartureTime = new Date(adjustedArrivalTime.getTime() - duration * 1000);
      } else {
        break;
      }
    } while (true);

    return { duration, departureTime: estimatedDepartureTime };
  }

  public async getPlaces(location: string, radius: number): Promise<string[]> {
    const response = await this.client.placesNearby({
      params: {
        location,
        radius,
        type: 'pharmacy',
        key: this.GOOGLE_API_KEY,
      },
    });
    if (response.data.status === Status.OK) {
      console.log(response.data.results);
      return response.data.results.map((result) => result.place_id ?? 'none');
    }
    return [];
  }

  public async getPlaceDetails(placeId: string): Promise<string> {
    const response = await this.client.placeDetails({
      params: {
        place_id: placeId,
        key: this.GOOGLE_API_KEY,
      },
    });
    if (response.data.status === Status.OK) {
      console.log(response.data.result);
      console.log(response.data.result.opening_hours?.periods);
      // @ts-ignore
      console.log(response.data.result.current_opening_hours.periods);
    }
    return '';
  }
}
