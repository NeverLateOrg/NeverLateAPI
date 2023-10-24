import { Injectable } from '@nestjs/common';
import { CreateEventDTO } from '../events/dtos';
import { EventsService } from '../events/events.service';
import { GoogleService } from '../google/google.service';
import { WeekOpeningPeriod } from '../locations/schemas/weekOpeningPeriod.schema';
import { UserPlaceLocationsService } from '../locations/user/place/user.locations.place.service';
import { User } from '../users/schemas/user.schema';
import { MorningAfternoonConstraint } from './Constraints/HoursConstraint';
import { OpeningHoursConstraint } from './Constraints/OpeningHoursConstraint';
import { OverlapCalendarConstraint } from './Constraints/OverlapCalendarConstraint';
import { CSP } from './CPS/Csp';
import { FlexEventRequestDto } from './dtos/flex-event.request.dto';
import { FlexEventsRepository } from './flex-events.repository';
import { FlexEvent } from './schemas/flex-event.schema';

export type EventCSP = CreateEventDTO & {
  openingHours?: WeekOpeningPeriod;
};

@Injectable()
export class FlexEventsService {
  constructor(
    private readonly flexEventRepository: FlexEventsRepository,
    private readonly googleService: GoogleService,
    private readonly placeLocationService: UserPlaceLocationsService,
    private readonly eventsService: EventsService,
  ) {}

  public async getMyFlexEvent(user: User): Promise<FlexEvent[]> {
    return await this.flexEventRepository.find({ user });
  }

  public async createFlexEvent(user: User, dto: FlexEventRequestDto): Promise<void> {
    const flexDoc = await this.flexEventRepository.create({ ...dto, user });

    const step = 15;
    const events: EventCSP[] = [];

    // * get opening hours
    let openingHours: WeekOpeningPeriod | undefined;
    if (dto.savedLocationType === 'UserPlaceLocation' && dto.savedLocation !== undefined) {
      const place = await this.placeLocationService.getPlaceLocation(user, dto.savedLocation);
      openingHours = place.placeLocation.opening_hours;
    }

    const startDate = new Date(dto.min_date);
    startDate.setUTCHours(2);
    const endDate = new Date(dto.max_date);
    endDate.setUTCHours(25, 59, 59, 999);

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const event: EventCSP = {
        title: dto.name + ' - instance',
        start_date: currentDate,
        end_date: new Date(currentDate.getTime() + 60 * 60 * 1000),
        location: dto.location,
        savedLocation: dto.savedLocation,
        savedLocationType: dto.savedLocationType,
        openingHours,
      };
      events.push(event);
      currentDate = new Date(currentDate.getTime() + step * 60 * 1000);
    }

    const fixedEvents = await this.eventsService.getUserEventsInRange(user, startDate, endDate);

    const csp = new CSP<EventCSP>();
    csp
      .withVariable('event', events)
      .withConstraint(new OverlapCalendarConstraint(['event'], fixedEvents))
      .withConstraint(new OpeningHoursConstraint(['event'], this.googleService, this.placeLocationService));
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
