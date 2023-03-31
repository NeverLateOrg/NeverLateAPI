/* eslint-disable @typescript-eslint/consistent-type-imports */

import { Injectable } from '@nestjs/common';
import { Event } from 'src/modules/events/schemas/event.schema';
import { Travel } from '../Storage/storage.schema';
import DefaultTravelCalculator from './DefaultTravelCalculator';
import GoogleTravelCalculator from './GoogleTravelCalculator';
import ITravelCalculator from './ITravelCalculator';

@Injectable()
export class TravelsCalculatorService {
  private readonly _calculators: ITravelCalculator[] = [new DefaultTravelCalculator(), new GoogleTravelCalculator()];

  private getCalculator(type: string): ITravelCalculator | undefined {
    return this._calculators.find((calc) => calc.type === type);
  }

  public async travelBetween(type: string, from: Event, to: Event): Promise<Travel | null> {
    const calculator = this.getCalculator(type);
    if (calculator === undefined) {
      throw new Error('Unknown travel calculator');
    }
    return await calculator.travelBetween(from, to);
  }
}
