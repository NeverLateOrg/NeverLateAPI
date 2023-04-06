import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import toDTO from 'src/utils/dtoConvertor';
import { GetUser } from '../authentification/decorator';
import { JwtGuard } from '../authentification/guard';
import { User } from '../users/user.schema';
import { CreateEventDTO, ResponseEventDTO, UpdateEventDTO } from './dtos';
import { EventsManagerService } from './eventsManager.service';

@ApiTags('Events')
@ApiBearerAuth()
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
  @UseGuards(JwtGuard)
  @Post()
  public async createEvent(@GetUser() user: User, @Body() createEventDTO: CreateEventDTO): Promise<ResponseEventDTO> {
    const event = await this.service.createEvent(user, createEventDTO);
    const dto = toDTO(ResponseEventDTO, event);
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
  @UseGuards(JwtGuard)
  @Get()
  public async getAllEvents(@GetUser() user: User): Promise<ResponseEventDTO[]> {
    const events = await this.service.getUserEvents(user);
    return events.map((event) => toDTO(ResponseEventDTO, event));
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
  @UseGuards(JwtGuard)
  @Get(':eventId')
  public async getEvent(@GetUser() user: User, @Param('eventId') eventId: string): Promise<ResponseEventDTO> {
    const event = await this.service.getUserEvent(user, eventId);
    if (event === null) {
      throw new NotFoundException();
    }
    return toDTO(ResponseEventDTO, event);
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
  @UseGuards(JwtGuard)
  @Delete(':eventId')
  public async deleteEvent(@GetUser() user: User, @Param('eventId') eventId: string): Promise<void> {
    const success = await this.service.deleteEvent(user, eventId);
    if (!success) {
      throw new NotFoundException('Event not found. Please check the eventId parameter.');
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
  @UseGuards(JwtGuard)
  @Put(':eventId')
  public async updateEvent(
    @GetUser() user: User,
    @Param('eventId') eventId: string,
    @Body() updateEventDTO: UpdateEventDTO,
  ): Promise<ResponseEventDTO> {
    const event = await this.service.updateEvent(user, eventId, updateEventDTO);
    return toDTO(ResponseEventDTO, event);
  }
}
