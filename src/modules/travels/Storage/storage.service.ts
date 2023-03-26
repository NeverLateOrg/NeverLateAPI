/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../../events/schemas/event.schema';
import { TravelsCalculatorService } from '../Calculator/calculator.service';
import { Travel, Travels, TravelsDocument } from './storage.schema';

@Injectable()
export class TravelsStorageService {
  constructor(
    @InjectModel(Travels.name) private readonly TravelsModel: Model<TravelsDocument>,
    private readonly travelsCalculatorService: TravelsCalculatorService,
    private readonly eventManagerService: any,
  ) {}

  private async deleteTravels(event: Event): Promise<boolean> {
    return (await this.TravelsModel.deleteOne({ destinationEvent: event })).deletedCount > 0;
  }

  private async setTravels(destinationEvent: Event, previousEvents: Event[]): Promise<Travels | null> {
    await this.deleteTravels(destinationEvent);
    if (destinationEvent.location === undefined) {
      return null;
    }
    const travels: Travel[] = [];
    for (const previousEvent of previousEvents) {
      const travel = await this.travelsCalculatorService.travelBetween('google', destinationEvent, previousEvent);
      if (travel !== null) {
        travels.push(travel);
      }
    }

    return await this.TravelsModel.create({
      destinationEvent,
      travels,
    });
  }

  public async handleTravels(event: Event): Promise<void> {
    // Get Next events of the current event
    const nextEvents: Event[] = await this.eventManagerService.getNextEvents(event);
    // Get Previous events of the current event
    const previousEvents: Event[] = await this.eventManagerService.GetPreviousEvents(event);

    if (previousEvents.length > 0) {
      await this.setTravels(event, previousEvents);
    }

    for (const nextEvent of nextEvents) {
      await this.setTravels(nextEvent, [event]);
      // To be upgrade if there is at least another event at the same time
    }
  }
}
