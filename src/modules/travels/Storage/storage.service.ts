/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsRepository } from 'src/modules/events/events.repository';
import { Event } from '../../events/schemas/event.schema';
import { TravelsCalculatorService } from '../Calculator/calculator.service';
import { Travel, Travels, TravelsDocument } from './storage.schema';

@Injectable()
export class TravelsStorageService {
  constructor(
    @InjectModel(Travels.name) private readonly TravelsModel: Model<TravelsDocument>,
    private readonly travelsCalculatorService: TravelsCalculatorService,
    private readonly eventRepository: EventsRepository,
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
      const travel = await this.travelsCalculatorService.travelBetween(previousEvent, destinationEvent);
      if (travel !== null) {
        travels.push(travel);
      }
    }

    return await this.TravelsModel.create({
      destinationEvent,
      travels,
    });
  }

  public async handleNewTravels(event: Event): Promise<void> {
    const nextEvents = await this.eventRepository.findNextEvents(event);
    const previousEvents = await this.eventRepository.findPreviousEvents(event);

    if (previousEvents.length > 0) {
      await this.setTravels(event, previousEvents);
    }

    for (const nextEvent of nextEvents) {
      await this.setTravels(nextEvent, [event]);
      // To be upgrade if there is at least another event at the same time
    }
    // TODO
  }

  public async handleDeleteTravels(event: Event): Promise<void> {
    await this.deleteTravels(event);

    // TODO
  }

  public async handleUpdateTravels(event: Event): Promise<void> {
    // TODO optimize
    await this.handleDeleteTravels(event);
    await this.handleNewTravels(event);
  }

  public async getTravelsOfEvent(event: Event): Promise<Travels | null> {
    return await this.TravelsModel.findOne({ destinationEvent: event });
  }
}
