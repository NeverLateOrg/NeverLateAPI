/*
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

export class HoursConstraint extends Constraint<CalendarEvent> {
  private readonly startTime: Time;
  private readonly endTime: Time;

  constructor(variable: string, startTime: Time, endTime: Time) {
    super([variable]);
    this.startTime = startTime;
    this.endTime = endTime;
  }

  isSatisfied(assignment: Record<string, CalendarEvent>): boolean {
    const event = assignment[this.variables[0]];
    if (event.end.getTime() - event.start.getTime() > 1000 * 60 * 60 * 24) {
      return false; // if the event is longer than a day, it's not valid
    }
    const eventStartTime = Time.fromDate(event.start);
    const eventEndTime = Time.fromDate(event.end);
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
*/
