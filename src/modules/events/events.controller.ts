import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { ObjectIdPipe } from 'src/utils/pipes';
import { GetUser } from '../authentification/decorator';
import { JwtGuard } from '../authentification/guard';
import { User } from '../users/schemas/user.schema';
import { CreateEventDTO, ResponseEventDTO, ResponseEventNoTravelsDTO, UpdateEventDTO } from './dtos';
import { CreateEventsIcsDTO } from './dtos/create-events-ics.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('/events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

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
    console.log('dto :', createEventDTO);
    const { event, travels } = await this.eventService.createEvent(user, createEventDTO);
    const dto = ResponseEventDTO.build(event, travels);
    return dto;
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The events has been successfully added.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check the request body.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Post('ics')
  public async createEventsFromICS(
    @GetUser() user: User,
    @Body() createEventsIcsDTO: CreateEventsIcsDTO,
  ): Promise<any> {
    await this.eventService.addEventsFromIcs(user, createEventsIcsDTO.url);
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
    const events = await this.eventService.getUserEvents(user);
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
  @UseGuards(JwtGuard)
  @Get(':eventId')
  public async getEvent(
    @GetUser() user: User,
    @Param('eventId', ObjectIdPipe) eventId: string,
  ): Promise<ResponseEventDTO> {
    const data = await this.eventService.getUserEvent(user, eventId);
    if (data === null) {
      throw new NotFoundException();
    }
    return ResponseEventDTO.build(data.event, data.travels);
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
  @HttpCode(204)
  public async deleteEvent(@GetUser() user: User, @Param('eventId', ObjectIdPipe) eventId: string): Promise<void> {
    const success = await this.eventService.deleteEvent(user, eventId);
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
    @Param('eventId', ObjectIdPipe) eventId: string,
    @Body() updateEventDTO: UpdateEventDTO,
  ): Promise<ResponseEventDTO> {
    try {
      const { event, travels } = await this.eventService.updateEvent(user, eventId, updateEventDTO);
      return ResponseEventDTO.build(event, travels);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The event has been accepted successfully.',
    type: ResponseEventNoTravelsDTO,
  })
  @ApiNotFoundResponse({
    description: 'Event not found. Please check the eventId parameter.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Put(':eventId/accept')
  public async acceptEvent(
    @GetUser() user: User,
    @Param('eventId', ObjectIdPipe) eventId: string,
  ): Promise<ResponseEventDTO> {
    const event = await this.eventService.acceptEvent(user, eventId);
    return ResponseEventNoTravelsDTO.build(event);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The event has been declined successfully.',
    type: ResponseEventNoTravelsDTO,
  })
  @ApiNotFoundResponse({
    description: 'Event not found. Please check the eventId parameter.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtGuard)
  @Put(':eventId/decline')
  public async declineEvent(
    @GetUser() user: User,
    @Param('eventId', ObjectIdPipe) eventId: string,
  ): Promise<ResponseEventDTO> {
    const event = await this.eventService.declineEvent(user, eventId);
    return ResponseEventNoTravelsDTO.build(event);
  }
}
