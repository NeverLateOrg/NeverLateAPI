import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventDTO, ResponseEventDTO } from './dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  public async addEvent(@Body() dto: CreateEventDTO): Promise<ResponseEventDTO> {
    return await this.eventsService.addEvent(dto);
  }
}
