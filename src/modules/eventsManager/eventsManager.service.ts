import { Inject, Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { Event } from '../events/schemas/event.schema';
import { TravelsStorageService } from '../travels/Storage/storage.service';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateEventDTO, DeleteEventDTO, UpdateEventDTO } from './dto';

@Injectable()
export class EventsManagerService {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(TravelsStorageService)
  private readonly travelStorageService: TravelsStorageService;

  public async createEvent(user: User, createEventDTO: CreateEventDTO): Promise<Event> {
    const createdEvent = await this.eventsService.createEvent(user, createEventDTO);
    await this.travelStorageService.handleTravels(createdEvent);
    console.log(`event id = ${createdEvent.id}`);
    return createdEvent;
  }

  public async updateEvent(updateEventDTO: UpdateEventDTO): Promise<Event> {
    return await this.eventsService.updateEvent(updateEventDTO);
  }

  public async getUserEvents(user: User): Promise<Event[]> {
    return await this.eventsService.getUserEvents(user);
  }

  public async deleteEvent(deleteEventDTO: DeleteEventDTO): Promise<boolean> {
    const eventSuccess = await this.eventsService.deleteEvent(deleteEventDTO._id);
    return eventSuccess;
  }
}
