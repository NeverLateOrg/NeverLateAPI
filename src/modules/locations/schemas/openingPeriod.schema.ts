import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface WeekDate {
  day: number;
  time: string;
}

@Schema({ _id: false })
export class OpeningPeriod {
  constructor(data: Partial<OpeningPeriod>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, type: Object })
  open: WeekDate;

  @Prop({ required: false, type: Object })
  close?: WeekDate;

  private static compare(d1: WeekDate, d2: WeekDate): number {
    if (d1.day < d2.day) return -1;
    if (d1.day > d2.day) return 1;
    if (d1.time < d2.time) return -1;
    if (d1.time > d2.time) return 1;
    return 0;
  }

  public getNormalize(): OpeningPeriod {
    if (this.isReverse() && this.close !== undefined) {
      return new OpeningPeriod({
        open: this.open,
        close: {
          day: this.close.day + 7,
          time: this.close.time,
        },
      });
    }
    return new OpeningPeriod({ open: this.open, close: this.close });
  }

  public isReverse(): boolean {
    if (this.close !== undefined && OpeningPeriod.compare(this.close, this.open) < 0) {
      return true;
    }
    return false;
  }

  public containsInside(date: Date): boolean {
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

export const OpeningPeriodSchema = SchemaFactory.createForClass(OpeningPeriod);
