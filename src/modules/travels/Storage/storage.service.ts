/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsRepository } from 'src/modules/events/events.repository';
import { EventsService } from 'src/modules/events/events.service';
import { Event } from '../../events/schemas/event.schema';
import { TravelsCalculatorService } from '../Calculator/calculator.service';
import { Travel, Travels, TravelsDocument } from './storage.schema';

@Injectable()
export class TravelsStorageService {
  constructor(
    @InjectModel(Travels.name) private readonly TravelsModel: Model<TravelsDocument>,
    private readonly travelsCalculatorService: TravelsCalculatorService,
    private readonly eventRepository: EventsRepository,
    private readonly eventService: EventsService,
  ) {}

  private async deleteTravels(event: Event): Promise<boolean> {
    return (await this.TravelsModel.deleteOne({ destinationEvent: event })).deletedCount > 0;
  }

  private async deleteTravelsOfEvent(event: Event): Promise<boolean> {
    return (await this.TravelsModel.deleteMany({ destinationEvent: event })).deletedCount > 0;
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
    const nextEvents = await this.eventService.getNextEventsOfEvent(event);
    const previousEvents = await this.eventService.getPreviousEventsOfEvent(event);
    const simultaneousEvents = await this.eventService.getSimultaneousEventsOfEvent(event);
    if (previousEvents.length > 0) {
      await this.setTravels(event, previousEvents);
    }

    for (const nextEvent of nextEvents) {
      await this.setTravels(nextEvent, [event]);
      // To be upgrade if there is at least another event at the same time
    }

    // TODO : Test the behaviour of this function.
    for (const simultaneousEvent of simultaneousEvents) {
      if (simultaneousEvent.start_date < event.start_date) {
        await this.setTravels(event, [simultaneousEvent]);
      } else {
        await this.setTravels(simultaneousEvent, [event]);
      }
    }
  }

  public async handleDeleteTravels(event: Event): Promise<void> {
    const prevEvents = await this.eventService.getPreviousEventsOfEvent(event);
    const nextEvents = await this.eventService.getNextEventsOfEvent(event);
    const simultaneousEvents = await this.eventService.getSimultaneousEventsOfEvent(event);

    // deleted all travels linked to one event : event.
    await this.deleteTravelsOfEvent(event);

    // recalculate travels for prev and next event.
    for (const nextEvent of nextEvents) {
      await this.setTravels(nextEvent, prevEvents);
    }

    // recalculate for simultaneous event.

    for (const prevEvent of prevEvents) {
      for (const simultaneousEvent of simultaneousEvents) {
        if (prevEvent.start_date <= simultaneousEvent.start_date) {
          await this.setTravels(simultaneousEvent, [prevEvent]);
        } else {
          await this.setTravels(prevEvent, [simultaneousEvent]);
        }
      }
    }
    for (const nextEvent of nextEvents) {
      for (const simultaneousEvent of simultaneousEvents) {
        if (simultaneousEvent.start_date <= nextEvent.start_date) {
          await this.setTravels(nextEvent, [simultaneousEvent]);
        } else {
          await this.setTravels(simultaneousEvent, [nextEvent]);
        }
      }
    }
  }

  public async handleUpdateTravels(eventBefore: Event, event: Event): Promise<void> {
    // TODO optimize
    await this.handleDeleteTravels(eventBefore);
    await this.handleNewTravels(event);
  }

  public async getTravelsOfEvent(event: Event): Promise<Travels | null> {
    return await this.TravelsModel.findOne({ destinationEvent: event });
  }
}
