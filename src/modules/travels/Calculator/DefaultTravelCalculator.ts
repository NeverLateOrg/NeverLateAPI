/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Event } from 'src/modules/events/event.schema';
import { Travel } from '../Storage/storage.schema';
import ITravelCalculator from './ITravelCalculator';

export default class DefaultTravelCalculator implements ITravelCalculator {
  public readonly type = 'default';

  public async travelBetween(from: Event, to: Event): Promise<Travel> {
    return { fromEvent: from, duration: Math.floor(Math.random() * 100 + 10) };
  }
}
