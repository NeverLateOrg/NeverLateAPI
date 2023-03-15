/* eslint-disable @typescript-eslint/consistent-type-imports */

import { Injectable } from '@nestjs/common';
import DefaultTravelCalculator from './DefaultTravelCalculator';
import ITravelCalculator, { Location, Travel } from './ITravelCalculator';

@Injectable()
export class CalculatorService {
  private readonly _calculators: ITravelCalculator[] = [new DefaultTravelCalculator()];

  private getCalculator(type: string): ITravelCalculator | undefined {
    return this._calculators.find((calc) => calc.type === type);
  }

  public travelBetween(type: string, from: Location, to: Location): Travel {
    const calculator = this.getCalculator(type);
    if (calculator === undefined) {
      throw new Error('Unknown travel calculator');
    }
    return calculator.travelBetween(from, to);
  }
}
