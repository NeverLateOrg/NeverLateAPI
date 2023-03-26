import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import { EventsManagerService } from './eventsManager.service';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';

const defaultUserId = '000000000000000000000000';
@Controller('/events')
export class EventsManagerController {
  constructor(private readonly service: EventsManagerService) {}

  @Post()
  public async createEvent(@Body() createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    // TODO: handle errors
    return await this.service.createEvent(defaultUserId, createEventDTO);
  }

  @Get()
  public async getAllEvents(): Promise<ResponseEventDTO[]> {
    // TODO: handle errors
    return await this.service.getUserEvents(defaultUserId);
  }

  @Delete()
  public async deleteEvent(@Body() deleteEventDTO: DeleteEventDTO): Promise<void> {
    // TODO: distinguish error from invalid id from other errors
    if (!(await this.service.deleteEvent(defaultUserId, deleteEventDTO))) {
      throw new HttpException('Delete failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  public async updateEvent(@Body() updateEventDTO: UpdateEventDTO): Promise<ResponseEventDTO> {
    try {
      return await this.service.updateEvent(updateEventDTO);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }
}
