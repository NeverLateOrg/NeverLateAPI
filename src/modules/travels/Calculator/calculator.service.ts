/* eslint-disable @typescript-eslint/consistent-type-imports */

import { TravelMode } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { Event } from 'src/modules/events/schemas/event.schema';
import { GoogleService } from 'src/modules/google/google.service';
import { Travel } from '../Storage/storage.schema';

@Injectable()
export class TravelsCalculatorService {
  constructor(private readonly googleService: GoogleService) {}

  public async travelBetween(from: Event, to: Event): Promise<Travel | null> {
    if (from.location === undefined || to.location === undefined) {
      return null;
    }
    const data = await this.googleService.calculateTravel(from.location, to.location, {
      mode: TravelMode.driving,
      arrivalTime: to.start_date,
      arrivalOffsetInMinutes: 0,
    });
    if (data === null) {
      return null;
    }
    return {
      fromEvent: from,
      duration: data.duration,
      departureDate: data.departureTime,
    };
  }
}
