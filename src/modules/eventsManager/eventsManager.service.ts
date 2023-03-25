import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';

@Injectable()
export class EventsManagerService {
  constructor(private readonly eventsService: EventsService, private readonly usersService: UsersService) {}

  public async createEvent(userId: string, createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    const createdEvent = await this.eventsService.createEvent(createEventDTO);
    await this.usersService.addEventToUser(userId, createdEvent._id);
    return createdEvent;
  }

  public async updateEvent(updateEventDTO: UpdateEventDTO): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  public async getUserEvents(userId: string): Promise<ResponseEventDTO[]> {
    const events: ResponseEventDTO[] = [];
    return events;
  }

  public async deleteEvent(userId: string, deleteEventDTO: DeleteEventDTO): Promise<boolean> {
    return false;
  }

  public async getNextEvents(userId: string, eventId: string): Promise<ResponseEventDTO[]> {
    const nextEvents: ResponseEventDTO[] = [];
    return nextEvents;
  }

  public async getPreviousEvents(userId: string, eventId: string): Promise<ResponseEventDTO[]> {
    const previousEvents: ResponseEventDTO[] = [];
    return previousEvents;
  }
}
