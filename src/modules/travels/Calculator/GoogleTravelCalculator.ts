/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Client, Status, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import { Event } from 'src/modules/events/event.schema';
import { Travel } from '../Storage/storage.schema';
import ITravelCalculator from './ITravelCalculator';

export default class GoogleTravelCalculator implements ITravelCalculator {
  public readonly type = 'google';
  private readonly client = new Client({});

  // temp hardcoded (will be change)
  private readonly GOOGLE_API_KEY = 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g';

  public async travelBetween(from: Event, to: Event): Promise<Travel | null> {
    const response = await this.client.directions({
      params: {
        origin: from.location ?? '',
        destination: to.location ?? '',
        mode: TravelMode.driving,
        units: UnitSystem.metric,
        key: this.GOOGLE_API_KEY,
      },
    });

    if (response.data.status === Status.OK) {
      const duration = response.data.routes[0].legs[0].duration.value;
      return { fromEvent: from, duration };
    }
    return null;
  }
}
