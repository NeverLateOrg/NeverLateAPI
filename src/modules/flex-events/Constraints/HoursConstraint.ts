import { CreateEventDTO } from 'src/modules/events/dtos';
import { Constraint } from '../CPS/Constraint';

export class Time {
  static fromDate(date: Date): Time {
    return new Time(date.getHours(), date.getMinutes());
  }

  public hour: number;
  public minute: number;

  constructor(hour: number, minute: number) {
    this.hour = hour;
    this.minute = minute;
  }

  isEqual(other: Time): boolean {
    return this.hour === other.hour && this.minute === other.minute;
  }

  isBefore(other: Time): boolean {
    return this.hour < other.hour || (this.hour === other.hour && this.minute < other.minute);
  }

  isAfter(other: Time): boolean {
    return this.hour > other.hour || (this.hour === other.hour && this.minute > other.minute);
  }

  isInInterval(start: Time, end: Time): boolean {
    if (start.isBefore(end)) {
      return this.isEqual(start) || this.isEqual(end) || (this.isAfter(start) && this.isBefore(end));
    } else {
      return this.isAfter(start) || this.isBefore(end) || this.isEqual(end) || this.isEqual(start);
    }
  }
}

export class HoursConstraint extends Constraint<CreateEventDTO> {
  protected startTime: Time;
  protected endTime: Time;

  constructor(variable: string, startTime: Time, endTime: Time) {
    super([variable]);
    this.startTime = startTime;
    this.endTime = endTime;
  }

  isSatisfied(assignment: Record<string, CreateEventDTO>): boolean {
    const event = assignment[this.variables[0]];
    if (event.end_date.getTime() - event.start_date.getTime() > 1000 * 60 * 60 * 24) {
      return false; // if the event is longer than a day, it's not valid
    }
    const eventStartTime = Time.fromDate(event.start_date);
    const eventEndTime = Time.fromDate(event.end_date);
    const eventIsBetweenTwoDays = eventEndTime.isBefore(eventStartTime);
    if (eventIsBetweenTwoDays) {
      eventEndTime.hour += 24;
    }
    const intervalIsBetweenTwoDays = this.endTime.isBefore(this.startTime);
    if (intervalIsBetweenTwoDays) {
      this.endTime.hour += 24;
    }
    const eventStartIsIn = eventStartTime.isInInterval(this.startTime, this.endTime);
    const eventEndIsIn = eventEndTime.isInInterval(this.startTime, this.endTime);
    return eventStartIsIn && eventEndIsIn;
  }
}

export class MorningAfternoonConstraint extends HoursConstraint {
  constructor(variable: string, type: 'morning' | 'afternoon') {
    super(variable, new Time(9, 0), new Time(14, 0));
    if (type === 'afternoon') {
      this.startTime = new Time(16, 0);
      this.endTime = new Time(22, 0);
    }
  }
}
