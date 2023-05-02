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
    const day = date.getDay();
    const time = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');

    let filteredPeriods = this.periods.filter((period) => period.open.day === day && period.open.time <= time);
    if (filteredPeriods.length !== 0) {
      filteredPeriods.sort((a, b) => b.open.time.localeCompare(a.open.time));
      const firstPeriod = filteredPeriods[0];
      const closeDate = firstPeriod.close;
      if (closeDate === undefined) return true;
      if (closeDate.day !== firstPeriod.open.day)
        if (closeDate.day !== day || closeDate.time < firstPeriod.open.time || closeDate.time >= time) {
          return true;
        }
      return false;
    }
    for (let i = 1; i < 7; i++) {
      const currentDay = (day - i + 7) % 7;
      filteredPeriods = this.periods.filter((period) => period.open.day === currentDay);
      if (filteredPeriods.length === 0) continue;
      filteredPeriods.sort((a, b) => b.open.time.localeCompare(a.open.time));
      const firstPeriod = filteredPeriods[0];
      const closeDate = firstPeriod.close;
      if (closeDate === undefined) return true;

      return false;
    }
    return false;
  }
}

export const WeekOpeningPeriodSchema = SchemaFactory.createForClass(WeekOpeningPeriod);
