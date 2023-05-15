/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsRepository, SearchContext } from 'src/modules/events/events.repository';
import { Event } from '../../events/schemas/event.schema';
import { TravelsCalculatorService } from '../Calculator/calculator.service';
import { Travel, Travels, TravelsDocument } from './storage.schema';

@Injectable()
export class TravelsStorageService {
  constructor(
    @InjectModel(Travels.name) private readonly TravelsModel: Model<TravelsDocument>,
    private readonly travelsCalculatorService: TravelsCalculatorService,
    private readonly eventsRepository: EventsRepository,
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
    const nextEvents = await this.eventsRepository.getNextEventsOfEvent(event);
    const previousEvents = await this.eventsRepository.getPreviousEventsOfEvent(event);

    if (previousEvents.length > 0) {
      await this.setTravels(event, previousEvents);
    }

    for (const nextEvent of nextEvents) {
      // Can be optimized
      const simultaneousEvents = await this.eventsRepository.getSimultaneousEventsOfEvent(event, {
        event: nextEvent,
        searchContext: SearchContext.PREVIOUS,
      });
      await this.setTravels(nextEvent, [event, ...simultaneousEvents]);
    }
  }

  public async handleDeleteTravels(event: Event): Promise<void> {
    const nextEvents = await this.eventsRepository.getNextEventsOfEvent(event);

    // deleted all travels linked to one event : event.
    await this.deleteTravels(event);

    // recalculate travels for prev and next event.
    for (const nextEvent of nextEvents) {
      const nextPrevEvents = await this.eventsRepository.getPreviousEventsOfEvent(nextEvent);
      await this.setTravels(nextEvent, nextPrevEvents);
    }
  }

  public async handleUpdateTravels(eventBefore: Event, event: Event): Promise<void> {
    // Can be optimized
    await this.handleDeleteTravels(eventBefore);
    await this.handleNewTravels(event);
  }

  public async getTravelsOfEvent(event: Event): Promise<Travels | null> {
    return await this.TravelsModel.findOne({ destinationEvent: event });
  }
}
