import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/user.schema';
import { CreateEventDTO, ResponseEventDTO, UpdateEventDTO } from './dtos';
import { EventsManagerService } from './eventsManager.service';

const defaultUser: User = new User({ _id: '6421b003540da20b8a509cc3', email: 'pierre@gmail.com', firstName: 'Pierre' });

@ApiTags('Events')
@Controller('/events')
export class EventsManagerController {
  constructor(private readonly service: EventsManagerService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The event has been successfully created.',
    type: ResponseEventDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check the request body.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Post()
  public async createEvent(@Body() createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    const { event, travels } = await this.service.createEvent(defaultUser, createEventDTO);
    const dto = ResponseEventDTO.build(event, travels);
    console.log(event, dto);
    return dto;
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of events retrieved successfully.',
    type: [ResponseEventDTO],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Get()
  public async getAllEvents(): Promise<ResponseEventDTO[]> {
    const events = await this.service.getUserEvents(defaultUser);
    return events.map(({ event, travels }) => ResponseEventDTO.build(event, travels));
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The event has been retrieved successfully.',
    type: ResponseEventDTO,
  })
  @ApiNotFoundResponse({
    description: 'Event not found. Please check the eventId parameter.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Get(':eventId')
  public async getEvent(@Param('eventId') eventId: string): Promise<ResponseEventDTO> {
    return new ResponseEventDTO();
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'The event has been deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Event not found. Please check the eventId parameter.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Delete(':eventId')
  public async deleteEvent(@Param('eventId') eventId: string): Promise<void> {
    if (!(await this.service.deleteEvent(eventId))) {
      throw new HttpException('Delete failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The event has been updated successfully.',
    type: ResponseEventDTO,
  })
  @ApiNotFoundResponse({
    description: 'Event not found. Please check the eventId parameter.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Put(':eventId')
  public async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDTO: UpdateEventDTO,
  ): Promise<ResponseEventDTO> {
    try {
      const { event, travels } = await this.service.updateEvent(updateEventDTO);
      return ResponseEventDTO.build(event, travels);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }
}
