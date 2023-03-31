/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Client, Status } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { Event } from 'src/modules/events/event.schema';

@Injectable()
export class LocationValidatorService {
  private readonly client = new Client({});

  // temp hardcoded (will be change)
  private readonly GOOGLE_API_KEY = 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g';

  public async format(event: Event): Promise<Event> {
    const response = await this.client.geocode({
      params: {
        address: event.location,
        key: this.GOOGLE_API_KEY,
      },
    });
    if (response.data.status === Status.OK) {
      // The query string was a valid address
      if (response.data.results.length > 0) {
        // we take the first result
        const location = response.data.results[0];
        event.location = location.formatted_address;
      }
    }
    return event;
  }
}
