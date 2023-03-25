import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import { CreateEventDTO, DeleteEventDTO, ResponseEventDTO, UpdateEventDTO } from './dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  public async createEvent(@Body() dto: CreateEventDTO): Promise<ResponseEventDTO> {
    // TODO: handle errors
    return await this.eventsService.createEvent(dto);
  }

  @Get()
  public async findAllEvents(): Promise<ResponseEventDTO[]> {
    return await this.eventsService.findAllEvents();
  }

  @Delete()
  public async deleteEvent(@Body() dto: DeleteEventDTO): Promise<void> {
    if (!(await this.eventsService.deleteEvent(dto))) {
      throw new HttpException('Delete failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  public async updateEvent(@Body() dto: UpdateEventDTO): Promise<ResponseEventDTO> {
    try {
      return await this.eventsService.updateEvent(dto);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }
}
