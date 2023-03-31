import { Event } from 'src/modules/events/schemas/event.schema';
import { Travel } from '../Storage/storage.schema';

export default interface ITravelCalculator {
  type: string;
  travelBetween: (from: Event, to: Event) => Promise<Travel | null>;
}
