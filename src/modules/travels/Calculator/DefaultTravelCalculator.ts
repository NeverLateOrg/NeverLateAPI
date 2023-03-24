/* eslint-disable @typescript-eslint/consistent-type-imports */
import ITravelCalculator, { Travel } from './ITravelCalculator';

export default class DefaultTravelCalculator implements ITravelCalculator {
  public readonly type = 'default';

  public travelBetween(from: string, to: string): Travel {
    return { distance: 10, time: 100 };
  }
}
