import { Injectable } from '@nestjs/common';
import { CreateEventDTO } from '../events/dtos';
import { EventsService } from '../events/events.service';
import { User } from '../users/schemas/user.schema';
import { MorningAfternoonConstraint } from './Constraints/HoursConstraint';
import { OverlapCalendarConstraint } from './Constraints/OverlapCalendarConstraint';
import { CSP } from './CPS/Csp';
import { FlexEventRequestDto } from './dtos/flex-event.request.dto';
import { FlexEventsRepository } from './flex-events.repository';
import { FlexEvent } from './schemas/flex-event.schema';

@Injectable()
export class FlexEventsService {
  constructor(
    private readonly flexEventRepository: FlexEventsRepository,
    private readonly eventsService: EventsService,
  ) {}

  public async getMyFlexEvent(user: User): Promise<FlexEvent[]> {
    return await this.flexEventRepository.find({ user });
  }

  public async createFlexEvent(user: User, dto: FlexEventRequestDto): Promise<void> {
    const flexDoc = await this.flexEventRepository.create({ ...dto, user });

    const step = 15;

    const events: CreateEventDTO[] = [];
    const startDate = new Date(dto.min_date);
    startDate.setUTCHours(2);
    const endDate = new Date(dto.max_date);
    endDate.setUTCHours(25, 59, 59, 999);

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const event = {
        title: dto.name + ' - instance',
        start_date: currentDate,
        end_date: new Date(currentDate.getTime() + 60 * 60 * 1000),
      } as CreateEventDTO;
      events.push(event);
      currentDate = new Date(currentDate.getTime() + step * 60 * 1000);
    }

    const fixedEvents = await this.eventsService.getUserEventsInRange(user, startDate, endDate);

    const csp = new CSP<CreateEventDTO>();
    csp.withVariable('event', events).withConstraint(new OverlapCalendarConstraint(['event'], fixedEvents));
    for (const constraint of dto.constraints) {
      if (constraint.type === 'MorningAfternoonConstraint') {
        csp.withConstraint(new MorningAfternoonConstraint('event', constraint.choice));
      }
    }

    const solution = csp.solve();
    if (solution != null) {
      const { event } = await this.eventsService.createEvent(user, solution.event);
      flexDoc.event = event;
      await flexDoc.save();
    }
  }
}
