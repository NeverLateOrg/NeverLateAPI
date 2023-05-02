import { OpeningPeriod } from '../openingPeriod.schema';

function getDateFromWeekDay(weekDay: number, hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setDate(date.getDate() + ((weekDay - date.getDay() + 7) % 7));
  return date;
}

describe('OpeningPeriodSchema', () => {
  describe('should return true if date is inside opening period', () => {
    it('basic one day period', () => {
      const period = new OpeningPeriod({
        open: { day: 1, time: '0900' },
        close: { day: 1, time: '1700' },
      });
      expect(period.isInside(getDateFromWeekDay(1, 12, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(1, 18, 0))).toBe(false);
      expect(period.isInside(getDateFromWeekDay(2, 12, 0))).toBe(false);
      expect(period.isInside(getDateFromWeekDay(0, 12, 0))).toBe(false);
    });
    it('period over multiple days', () => {
      const period = new OpeningPeriod({
        open: { day: 1, time: '0900' },
        close: { day: 3, time: '1700' },
      });
      expect(period.isInside(getDateFromWeekDay(1, 9, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(2, 12, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(3, 17, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(4, 17, 0))).toBe(false);
      expect(period.isInside(getDateFromWeekDay(0, 17, 0))).toBe(false);
    });
    it('period over multiple days (module using)', () => {
      const period = new OpeningPeriod({
        open: { day: 5, time: '0900' },
        close: { day: 3, time: '1700' },
      });
      expect(period.isInside(getDateFromWeekDay(6, 12, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(0, 12, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(4, 12, 0))).toBe(false);
      expect(period.isInside(getDateFromWeekDay(5, 9, 0))).toBe(true);
      expect(period.isInside(getDateFromWeekDay(5, 8, 0))).toBe(false);
    });
  });
});
