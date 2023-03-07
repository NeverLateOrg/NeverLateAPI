import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEventDTO, ResponseEventDTO } from './dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  public async createEvent(@Body() dto: CreateEventDTO): Promise<ResponseEventDTO> {
    return await this.eventsService.createEvent(dto);
  }

  @Get()
  public async findAllEvents(): Promise<ResponseEventDTO[]> {
    return await this.eventsService.findAllEvents();
  }
}
