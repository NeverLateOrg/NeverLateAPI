import { Prop, Schema } from '@nestjs/mongoose';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';
import { OpeningPeriod, OpeningPeriodSchema } from './openingPeriod.schema';

class WeekOpeningPeriodMethods {
  willBeOpenAt(this: WeekOpeningPeriod, date: Date): boolean {
    for (const period of this.periods) {
      if (period.containsInside(date)) return true;
    }
    return false;
  }
}

@Schema({ _id: false })
export class WeekOpeningPeriod extends WeekOpeningPeriodMethods {
  constructor(periods: OpeningPeriod[]) {
    super();
    this.periods = periods;
  }

  @Prop({ type: [OpeningPeriodSchema] })
  periods: OpeningPeriod[];
}

export const WeekOpeningPeriodSchema = SchemaFactoryCustom.createForClass(WeekOpeningPeriod, WeekOpeningPeriodMethods);
