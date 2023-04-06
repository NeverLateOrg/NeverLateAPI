import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../events/event.schema';
import { EventsService } from '../events/events.service';
import { TravelsStorageService } from '../travels/Storage/storage.service';
import { User } from '../users/user.schema';
import { CreateEventDTO, UpdateEventDTO } from './dtos';

@Injectable()
export class EventsManagerService {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Inject(TravelsStorageService)
  private readonly travelStorageService: TravelsStorageService;

  public async createEvent(user: User, createEventDTO: CreateEventDTO): Promise<Event> {
    const createdEvent = await this.eventsService.createEvent(user, createEventDTO);
    await this.travelStorageService.handleNewTravels(createdEvent);
    return createdEvent;
  }

  public async updateEvent(user: User, eventId: string, updateEventDTO: UpdateEventDTO): Promise<Event> {
    const event = await this.eventsService.updateEvent(user, eventId, updateEventDTO);
    await this.travelStorageService.handleUpdateTravels(event);
    return event;
  }

  public async getUserEvents(user: User): Promise<Event[]> {
    return await this.eventsService.getUserEvents(user);
  }

  public async getUserEvent(user: User, eventId: string): Promise<Event | null> {
    return await this.eventsService.getUserEvent(user, eventId);
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
