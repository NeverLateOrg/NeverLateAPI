import { GoogleService } from 'src/modules/google/google.service';
import { UserPlaceLocationsService } from 'src/modules/locations/user/place/user.locations.place.service';
import { Constraint } from '../CPS/Constraint';
import { EventCSP } from '../flex-events.service';

export class OpeningHoursConstraint extends Constraint<EventCSP> {
  constructor(variables: string[], googleService: GoogleService, placeLocationService: UserPlaceLocationsService) {
    super(variables);
  }

  isSatisfied(assignment: Record<string, EventCSP>): boolean {
    const varEvents = this.variables.map((v) => assignment[v]);
    for (const event of varEvents) {
      if (event.openingHours !== undefined) {
        if (!event.openingHours.willBeOpenAt(event.start_date)) return false;
        if (!event.openingHours.willBeOpenAt(event.end_date)) return false;
      }
    }
    return true;
  }
}
