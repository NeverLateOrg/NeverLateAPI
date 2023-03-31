import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import toDTO from 'src/utils/dtoConvertor';
import { User } from '../users/schemas/user.schema';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';
import { EventsManagerService } from './eventsManager.service';

const defaultUser: User = new User({ id: '6421b003540da20b8a509cc3', email: 'pierre@gmail.com', name: 'Pierre' });

@Controller('/events')
export class EventsManagerController {
  constructor(private readonly service: EventsManagerService) {}

  @Post()
  public async createEvent(@Body() createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    // TODO: handle errors
    const event = await this.service.createEvent(defaultUser, createEventDTO);
    const dto = toDTO(ResponseEventDTO, event);
    return dto;
  }

  @Get()
  public async getAllEvents(): Promise<ResponseEventDTO[]> {
    // TODO: handle errors
    const events = await this.service.getUserEvents(defaultUser);
    return events.map((event) => toDTO(ResponseEventDTO, event));
  }

  @Delete()
  public async deleteEvent(@Body() deleteEventDTO: DeleteEventDTO): Promise<void> {
    // TODO: distinguish error from invalid id from other errors
    if (!(await this.service.deleteEvent(deleteEventDTO))) {
      throw new HttpException('Delete failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  public async updateEvent(@Body() updateEventDTO: UpdateEventDTO): Promise<ResponseEventDTO> {
    try {
      const event = await this.service.updateEvent(updateEventDTO);
      return toDTO(ResponseEventDTO, event);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }
}
