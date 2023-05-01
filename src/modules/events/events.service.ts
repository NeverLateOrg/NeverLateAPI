import { Injectable } from '@nestjs/common';
import { Travels } from '../travels/Storage/storage.schema';
import { TravelsStorageService } from '../travels/Storage/storage.service';
import { User } from '../users/schemas/user.schema';
import { CreateEventDTO, UpdateEventDTO } from './dtos';
import { EventsRepository } from './events.repository';
import { Event, EventStatus } from './schemas/event.schema';
@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly travelStorageService: TravelsStorageService,
  ) {}

  public async createEvent(
    user: User,
    createEventDTO: CreateEventDTO,
  ): Promise<{ event: Event; travels: Travels | null }> {
    const createdEvent = await this.eventRepository.createLocalEvent(user, createEventDTO);
    await this.travelStorageService.handleNewTravels(createdEvent);
    const travels = await this.travelStorageService.getTravelsOfEvent(createdEvent);
    return { event: createdEvent, travels };
  }

  public async updateEvent(
    user: User,
    eventId: string,
    updateEventDTO: UpdateEventDTO,
  ): Promise<{ event: Event; travels: Travels | null }> {
    const event = await this.eventRepository.getEventById(user, eventId);
    const updateEvent = await this.eventRepository.updateEvent(user, eventId, updateEventDTO);
    await this.travelStorageService.handleUpdateTravels(event, updateEvent);
    const travels = await this.travelStorageService.getTravelsOfEvent(updateEvent);
    return { event: updateEvent, travels };
  }

  // TODO TEST
  public async getPreviousEventsOfEvent(event: Event): Promise<Event[]> {
    try {
      return await this.eventRepository.getPreviousEventsOfEvent(event);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Error in getPreviousEventsOfEvent: ${error}`);
    }
  }

  // TODO TEST
  public async getNextEventsOfEvent(event: Event): Promise<Event[]> {
    try {
      return await this.eventRepository.getNextEventsOfEvent(event);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Error in getNextEventsOfEvent: ${error}`);
    }
  }

  // TODO TEST
  public async getSimultaneousEventsOfEvent(event: Event): Promise<Event[]> {
    try {
      return await this.eventRepository.getSimultaneousEventsOfEvent(event);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Error in getSimultaneousEventsOfEvent: ${error}`);
    }
  }

  public async getUserEvents(user: User): Promise<Array<{ event: Event; travels: Travels | null }>> {
    const events = await this.eventRepository.getUserEvents(user);
    return await Promise.all(
      events.map(async (event) => {
        const travels = await this.travelStorageService.getTravelsOfEvent(event);
        return { event, travels };
      }),
    );
  }

  public async getUserEvent(user: User, eventId: string): Promise<{ event: Event; travels: Travels | null } | null> {
    const event = await this.eventRepository.getUserEvent(user, eventId);
    const travels = await this.travelStorageService.getTravelsOfEvent(event as Event);
    return event != null ? { event, travels } : null;
  }

  /**
   * Delete an event and update the travel associated to it if needed (if the event is the last one of the travel)
   */
  public async deleteEvent(user: User, eventId: string): Promise<boolean> {
    const event = await this.eventRepository.getUserEvent(user, eventId);
    if (event == null) {
      return false;
    }
    await event.delete();
    await this.travelStorageService.handleDeleteTravels(event);
    return true;
  }

  public async acceptEvent(user: User, eventId: string): Promise<Event> {
    const event = await this.eventRepository.setEventStatus(user, eventId, EventStatus.ACCEPTED);
    return event;
  }

  public async declineEvent(user: User, eventId: string): Promise<Event> {
    const event = await this.eventRepository.setEventStatus(user, eventId, EventStatus.DECLINED);
    return event;
  }
}
