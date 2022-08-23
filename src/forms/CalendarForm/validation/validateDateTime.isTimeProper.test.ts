import { isTimeProper } from './validateDateTime';

const localeTimeFormat24 = 'HH:mm';
const localeTimeFormat12 = 'hh:mm A';

test('Missing real input value returns true (caught elsewhere)', () => {
  expect(isTimeProper(localeTimeFormat24, '', undefined)).toBe(true);
});

test('Proper 24-hour time values returns true', () => {
  expect(isTimeProper(localeTimeFormat24, '13:30', '13:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '13:30:00', '13:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '03:30', '03:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '03:30', '3:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '3:30', '03:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '3:30', '3:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '03:30:00', '03:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '03:30:00', '3:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '3:30:00', '03:30')).toBe(true);
  expect(isTimeProper(localeTimeFormat24, '3:30:00', '3:30')).toBe(true);
});

test('Proper 12-hour time values returns true', () => {
  expect(isTimeProper(localeTimeFormat12, '13:30', '1:30 PM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '13:30:00', '1:30 PM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '13:30', '01:30 PM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '13:30:00', '01:30 PM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '03:30', '03:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '03:30', '3:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '3:30', '03:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '3:30', '3:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '03:30:00', '03:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '03:30:00', '3:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '3:30:00', '03:30 AM')).toBe(true);
  expect(isTimeProper(localeTimeFormat12, '3:30:00', '3:30 AM')).toBe(true);
});

test('Missing real input value returns true (caught elsewhere)', () => {
  expect(isTimeProper(localeTimeFormat24, '', undefined)).toBe(true);
});

test('Invalid 24-hour time values returns false', () => {
  expect(isTimeProper(localeTimeFormat24, '13:30', '')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '13:30', 'foo')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '03:30', '25:29')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '03:30', '3:61')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '3:30', '03:30 AM')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '3:30', '15:30')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '3:30', '2:20')).toBe(false);
  expect(isTimeProper(localeTimeFormat24, '3:30', '23:20')).toBe(false);
});

test('Invalid 12-hour time values returns true', () => {
  expect(isTimeProper(localeTimeFormat12, '13:30', '')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '13:30', 'foo')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '13:30', '13:30')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '13:30', '13:30 AM')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '03:30', '25:29')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '03:30', '3:61')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '3:30', '03:30 PM')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '3:30', '15:30 AM')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '3:30', '2:20 AM')).toBe(false);
  expect(isTimeProper(localeTimeFormat12, '3:30', '23:20 AM')).toBe(false);
});
