import { CreateEventDTO } from 'src/modules/events/dtos';
import { Event } from 'src/modules/events/schemas/event.schema';
import { Constraint } from '../CPS/Constraint';

export class OverlapCalendarConstraint extends Constraint<CreateEventDTO> {
  private readonly events: Event[];

  constructor(variables: string[], events: Event[]) {
    super(variables);
    this.events = events;
  }

  compare(a: CreateEventDTO, b: CreateEventDTO): boolean {
    return a.start_date < b.end_date && b.start_date < a.end_date;
  }

  isSatisfied(assignment: Record<string, CreateEventDTO>): boolean {
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
