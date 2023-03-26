import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';

@Injectable()
export class EventsManagerService {
  @Inject(EventsService)
  private readonly eventsService: EventsService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  public async createEvent(userId: string, createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    const createdEvent = await this.eventsService.createEvent(createEventDTO);
    await this.usersService.addEventToUser(userId, createdEvent._id);
    // TODO: call the travel service here and remove logs
    console.log(await this.getNextEvent(userId, createdEvent._id));
    console.log(await this.getPreviousEvent(userId, createdEvent._id));
    return createdEvent;
  }

  public async updateEvent(updateEventDTO: UpdateEventDTO): Promise<ResponseEventDTO> {
    return await this.eventsService.updateEvent(updateEventDTO);
  }

  public async getUserEvents(userId: string): Promise<ResponseEventDTO[]> {
    return await this.usersService.getEvents(userId);
  }

  public async deleteEvent(userId: string, deleteEventDTO: DeleteEventDTO): Promise<boolean> {
    const eventSuccess = await this.eventsService.deleteEvent(deleteEventDTO);
    const userSuccess = await this.usersService.deleteEvent(userId, deleteEventDTO._id);
    return eventSuccess && userSuccess;
  }

  public async getNextEvent(userId: string, eventId: string): Promise<ResponseEventDTO | null> {
    const event = await this.eventsService.getEvent(eventId);
    if (event === null) {
      throw new NotFoundException(`event ${eventId} does not exist`);
    }
    return await this.usersService.findNextEvent(userId, event.end_date);
  }

  public async getPreviousEvent(userId: string, eventId: string): Promise<ResponseEventDTO | null> {
    const event = await this.eventsService.getEvent(eventId);
    if (event === null) {
      throw new NotFoundException(`event ${eventId} does not exist`);
    }
    return await this.usersService.findPreviousEvent(userId, event.start_date);
  }
}
