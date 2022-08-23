import * as Weekdays from '../test/data/Weekdays';
import { getFirstDayOfWeek, WEEKDAYS } from './WeekdayUtils';

test('First day of week is properly retrieved', () => {
  // united states
  expect(getFirstDayOfWeek('en-US')).toBe(WEEKDAYS[Weekdays.Sunday]);
  expect(getFirstDayOfWeek('en-us')).toBe(WEEKDAYS[Weekdays.Sunday]);

  // france
  expect(getFirstDayOfWeek('fr-FR')).toBe(WEEKDAYS[Weekdays.Monday]);
  expect(getFirstDayOfWeek('fr-fr')).toBe(WEEKDAYS[Weekdays.Monday]);

  // algeria
  expect(getFirstDayOfWeek('ar-DZ')).toBe(WEEKDAYS[Weekdays.Saturday]);
  expect(getFirstDayOfWeek('ar-dz')).toBe(WEEKDAYS[Weekdays.Saturday]);

  // invalid, fallback to Sunday
  expect(getFirstDayOfWeek('zz')).toBe(WEEKDAYS[Weekdays.Sunday]);
  expect(getFirstDayOfWeek('zz-zz')).toBe(WEEKDAYS[Weekdays.Sunday]);
});
