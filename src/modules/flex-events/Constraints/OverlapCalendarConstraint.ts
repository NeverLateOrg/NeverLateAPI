import { Event } from 'src/modules/events/schemas/event.schema';
import { Constraint } from '../CPS/Constraint';
import { EventCSP } from '../flex-events.service';

export class OverlapCalendarConstraint extends Constraint<EventCSP> {
  private readonly events: Event[];

  constructor(variables: string[], events: Event[]) {
    super(variables);
    this.events = events;
  }

  compare(a: EventCSP, b: EventCSP): boolean {
    return a.start_date < b.end_date && b.start_date < a.end_date;
  }

  isSatisfied(assignment: Record<string, EventCSP>): boolean {
    const varEvents = this.variables.map((v) => assignment[v]);
    for (const event of varEvents) {
      for (const eventBis of varEvents) {
        if (event !== eventBis && this.compare(event, eventBis)) {
          return false;
        }
      }
      for (const eventBis of this.events) {
        if (eventBis.overlaps(event)) {
          return false;
        }
      }
    }
    return true;
  }
}
