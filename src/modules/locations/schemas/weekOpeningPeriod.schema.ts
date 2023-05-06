import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OpeningPeriod, OpeningPeriodSchema } from './openingPeriod.schema';

@Schema({ _id: false })
export class WeekOpeningPeriod {
  constructor(data: Partial<WeekOpeningPeriod>) {
    Object.assign(this, data);
  }

  @Prop({ type: [OpeningPeriodSchema] })
  periods: OpeningPeriod[];

  public willBeOpenAt(date: Date): boolean {
    for (const period of this.periods) {
      if (period.containsInside(date)) return true;
    }
    return false;
  }
}

export const WeekOpeningPeriodSchema = SchemaFactory.createForClass(WeekOpeningPeriod);
