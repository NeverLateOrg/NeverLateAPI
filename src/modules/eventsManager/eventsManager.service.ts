import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../events/event.schema';
import { EventsService } from '../events/events.service';
import { Travels } from '../travels/Storage/storage.schema';
import { TravelsStorageService } from '../travels/Storage/storage.service';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { CreateEventDTO, UpdateEventDTO } from './dtos';

@Injectable()
export class EventsManagerService {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(TravelsStorageService)
  private readonly travelStorageService: TravelsStorageService;

  public async createEvent(
    user: User,
    createEventDTO: CreateEventDTO,
  ): Promise<{ event: Event; travels: Travels | null }> {
    const createdEvent = await this.eventsService.createEvent(user, createEventDTO);
    await this.travelStorageService.handleTravels(createdEvent);
    const travels = await this.travelStorageService.getTravelsOfEvent(createdEvent);
    return { event: createdEvent, travels };
  }

  public async updateEvent(updateEventDTO: UpdateEventDTO): Promise<{ event: Event; travels: Travels | null }> {
    const updatedEvent = await this.eventsService.updateEvent(updateEventDTO);
    const travels = await this.travelStorageService.getTravelsOfEvent(updatedEvent);
    return { event: updatedEvent, travels };
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

  public async deleteEvent(eventId: string): Promise<boolean> {
    const eventSuccess = await this.eventsService.deleteEvent(eventId);
    return eventSuccess;
  }
}
