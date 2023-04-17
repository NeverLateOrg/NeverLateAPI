import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../events/event.schema';
import { EventsService } from '../events/events.service';
import { Travels } from '../travels/Storage/storage.schema';
import { TravelsStorageService } from '../travels/Storage/storage.service';
import { User } from '../users/user.schema';
import { CreateEventDTO, UpdateEventDTO } from './dtos';

@Injectable()
export class EventsManagerService {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Inject(TravelsStorageService)
  private readonly travelStorageService: TravelsStorageService;

  public async createEvent(
    user: User,
    createEventDTO: CreateEventDTO,
  ): Promise<{ event: Event; travels: Travels | null }> {
    const createdEvent = await this.eventsService.createEvent(user, createEventDTO);
    await this.travelStorageService.handleNewTravels(createdEvent);
    const travels = await this.travelStorageService.getTravelsOfEvent(createdEvent);
    return { event: createdEvent, travels };
  }

  public async updateEvent(
    user: User,
    eventId: string,
    updateEventDTO: UpdateEventDTO,
  ): Promise<{ event: Event; travels: Travels | null }> {
    const event = await this.eventsService.updateEvent(user, eventId, updateEventDTO);
    await this.travelStorageService.handleUpdateTravels(event);
    const travels = await this.travelStorageService.getTravelsOfEvent(event);
    return { event, travels };
  }

  public async getUserEvents(user: User): Promise<Array<{ event: Event; travels: Travels | null }>> {
    const events = await this.eventsService.getUserEvents(user);
    return await Promise.all(
      events.map(async (event) => {
        const travels = await this.travelStorageService.getTravelsOfEvent(event);
        return { event, travels };
      }),
    );
  }

  public async getUserEvent(user: User, eventId: string): Promise<{ event: Event; travels: Travels | null } | null> {
    const event = await this.eventsService.getUserEvent(user, eventId);
    const travels = await this.travelStorageService.getTravelsOfEvent(event as Event);
    return event != null ? { event, travels } : null;
  }

  /**
   * Delete an event and update the travel associated to it if needed (if the event is the last one of the travel)
   */
  public async deleteEvent(user: User, eventId: string): Promise<boolean> {
    const event = await this.eventsService.getUserEvent(user, eventId);
    if (event == null) {
      return false;
    }
    await event.delete();
    await this.travelStorageService.handleDeleteTravels(event);
    return true;
  }
}
