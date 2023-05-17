import { OpeningPeriod } from '../openingPeriod.schema';
import { WeekOpeningPeriod } from '../weekOpeningPeriod.schema';

function getDateFromWeekDay(weekDay: number, hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setDate(date.getDate() + ((weekDay - date.getDay() + 7) % 7));
  return date;
}

describe('WeekOpeningPeriodSchema', () => {
  describe('24h/24h places', () => {
    const wop2424 = new WeekOpeningPeriod([new OpeningPeriod({ day: 0, time: '0000' })]);

    it('should be open on sunday at 00:00', () => {
      expect(wop2424.willBeOpenAt(getDateFromWeekDay(0, 0, 0))).toBe(true);
    });

    it('should be open on sunday at 23:59', () => {
      expect(wop2424.willBeOpenAt(getDateFromWeekDay(0, 23, 59))).toBe(true);
    });

    it('should be open on monday at 00:00', () => {
      expect(wop2424.willBeOpenAt(getDateFromWeekDay(1, 0, 0))).toBe(true);
    });

    it('should be open on wednesday at 12:00', () => {
      expect(wop2424.willBeOpenAt(getDateFromWeekDay(3, 12, 0))).toBe(true);
    });
  });

  describe('0h/0h places', () => {
    const wop = new WeekOpeningPeriod([]);

    it('should be close', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(1, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(2, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(3, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 12, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(6, 12, 0))).toBe(false);
    });
  });

  describe('places where open and close are not in the same day', () => {
    const wop = new WeekOpeningPeriod([
      new OpeningPeriod({ day: 0, time: '0730' }, { day: 1, time: '0100' }),
      new OpeningPeriod({ day: 1, time: '0730' }, { day: 2, time: '0100' }),
      new OpeningPeriod({ day: 2, time: '0730' }, { day: 3, time: '0100' }),
      new OpeningPeriod({ day: 3, time: '0730' }, { day: 4, time: '0200' }),
      new OpeningPeriod({ day: 4, time: '0730' }, { day: 5, time: '0200' }),
      new OpeningPeriod({ day: 5, time: '0730' }, { day: 6, time: '0300' }),
      new OpeningPeriod({ day: 6, time: '0730' }, { day: 0, time: '0300' }),
    ]);

    it('should be close on sunday 06:00', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 6, 0))).toBe(false);
    });

    it('should be open on sunday 07:30', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 7, 30))).toBe(true);
    });

    it('should be open on sunday 03:00', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 3, 0))).toBe(true);
    });

    it('should be close on wednesday 01:01', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(3, 1, 1))).toBe(false);
    });

    it('should be open on wednesday 12:00', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(3, 12, 0))).toBe(true);
    });
  });

  describe('places with break during the day (and a day off, and a half day)', () => {
    const wop = new WeekOpeningPeriod([
      new OpeningPeriod({ day: 1, time: '0845' }, { day: 1, time: '1230' }),
      new OpeningPeriod({ day: 1, time: '1430' }, { day: 1, time: '1900' }),
      new OpeningPeriod({ day: 2, time: '0845' }, { day: 2, time: '1230' }),
      new OpeningPeriod({ day: 2, time: '1430' }, { day: 2, time: '1900' }),
      new OpeningPeriod({ day: 3, time: '0845' }, { day: 3, time: '1230' }),
      new OpeningPeriod({ day: 3, time: '1430' }, { day: 3, time: '1900' }),
      new OpeningPeriod({ day: 4, time: '0845' }, { day: 4, time: '1230' }),
      new OpeningPeriod({ day: 4, time: '1430' }, { day: 4, time: '1900' }),
      new OpeningPeriod({ day: 5, time: '0845' }, { day: 5, time: '1230' }),
      new OpeningPeriod({ day: 5, time: '1430' }, { day: 5, time: '1900' }),
      new OpeningPeriod({ day: 6, time: '0845' }, { day: 6, time: '1230' }),
    ]);

    it('should be open on friday 09:00', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 9, 0))).toBe(true);
    });

    it('should be close on friday 13:00', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 13, 0))).toBe(false);
    });

    it('should be open on friday 14:30', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 14, 30))).toBe(true);
    });

    it('should be close on friday 19:01', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 19, 1))).toBe(false);
    });

    it('should be close on sunday', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 0, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 23, 59))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 9, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 13, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 16, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(0, 20, 0))).toBe(false);
    });

    it('should be close on saturday afternoon', () => {
      expect(wop.willBeOpenAt(getDateFromWeekDay(6, 15, 0))).toBe(false);
    });
  });

  describe('complex cases', () => {
    it('case 1', () => {
      const wop = new WeekOpeningPeriod([new OpeningPeriod({ day: 4, time: '1700' }, { day: 4, time: '1500' })]);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 18, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 16, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 14, 0))).toBe(true);
    });

    it('case 2', () => {
      const wop = new WeekOpeningPeriod([new OpeningPeriod({ day: 1, time: '0800' }, { day: 4, time: '1900' })]);
      expect(wop.willBeOpenAt(getDateFromWeekDay(3, 18, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(1, 7, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(1, 9, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 18, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(4, 20, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 12, 0))).toBe(false);
    });

    it('case 3', () => {
      const wop = new WeekOpeningPeriod([new OpeningPeriod({ day: 6, time: '0800' }, { day: 2, time: '1900' })]);
      expect(wop.willBeOpenAt(getDateFromWeekDay(1, 18, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(6, 7, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(6, 9, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(2, 18, 0))).toBe(true);
      expect(wop.willBeOpenAt(getDateFromWeekDay(2, 20, 0))).toBe(false);
      expect(wop.willBeOpenAt(getDateFromWeekDay(5, 12, 0))).toBe(false);
    });
  });
});
