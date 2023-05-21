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
    if (!from.hasLocation() || !to.hasLocation()) {
      return null;
    }
    const fromLocation = from.getLocationString();
    const toLocation = to.getLocationString();
    const data = await this.googleService.calculateTravel(fromLocation, toLocation, {
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
