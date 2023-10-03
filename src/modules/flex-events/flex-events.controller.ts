import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../authentification/decorator';
import { JwtGuard } from '../authentification/guard';
import { User } from '../users/schemas/user.schema';
import { FlexEventDto, FlexEventsResponseDto } from './dtos/flex-event.response.dto';
import { FlexEventsService } from './flex-events.service';

@ApiTags('Flex Events')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('/flex-events')
export class FlexEventsController {
  constructor(private readonly flexEventService: FlexEventsService) {}

  @Get()
  public async getFlexEvent(@GetUser() user: User): Promise<FlexEventsResponseDto> {
    const flexEvents = await this.flexEventService.getMyFlexEvent(user);
    const dtos = flexEvents.map((flexEvent) => FlexEventDto.from(flexEvent));
    return new FlexEventsResponseDto(dtos);
  }

  @Post()
  public async createFlexEvent(@GetUser() user: User, @Body() dto: any): Promise<void> {
    await this.flexEventService.createFlexEvent(user, dto);
  }
}
