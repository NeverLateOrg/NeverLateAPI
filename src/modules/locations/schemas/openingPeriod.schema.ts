/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Prop, Schema } from '@nestjs/mongoose';
import SchemaFactoryCustom from 'src/utils/schemas/SchemaFactoryCustom';

export interface WeekDate {
  day: number;
  time: string;
}

class OpeningPeriodMethods {
  private static compare(d1: WeekDate, d2: WeekDate): number {
    if (d1.day < d2.day) return -1;
    if (d1.day > d2.day) return 1;
    if (d1.time < d2.time) return -1;
    if (d1.time > d2.time) return 1;
    return 0;
  }

  public isReverse(this: OpeningPeriod): boolean {
    if (this.close !== undefined && OpeningPeriod.compare(this.close, this.open) < 0) {
      return true;
    }
    return false;
  }

  public getNormalize(this: OpeningPeriod): OpeningPeriod {
    if (this.isReverse() && this.close !== undefined) {
      return new OpeningPeriod(this.open, {
        day: this.close.day + 7,
        time: this.close.time,
      });
    }
    return new OpeningPeriod(this.open, this.close);
  }

  public containsInside(this: OpeningPeriod, date: Date): boolean {
    if (this.close === undefined) return true;
    let day = date.getDay();
    const time = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');

    if (this.isReverse() && OpeningPeriod.compare({ day, time }, this.open) < 0) {
      day += 7;
    }
    const newPeriod = this.getNormalize();
    if (newPeriod.close === undefined) return true;

    const open = `${newPeriod.open.day.toString().padStart(2, '0')}${newPeriod.open.time}`;
    const close = `${newPeriod.close.day.toString().padStart(2, '0')}${newPeriod.close.time}`;
    const target = `${day.toString().padStart(2, '0')}${time}`;
    return target >= open && target <= close;
  }
}

@Schema({ _id: false })
export class OpeningPeriod extends OpeningPeriodMethods {
  constructor(open: WeekDate, close?: WeekDate) {
    super();
    this.open = open;
    this.close = close;
  }

  @Prop({ required: true, type: Object })
  open: WeekDate;

  @Prop({ required: false, type: Object })
  close?: WeekDate;
}

export const OpeningPeriodSchema = SchemaFactoryCustom.createForClass(OpeningPeriod);
