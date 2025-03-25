import { isTimeProper } from './validateDateTime';

test('Missing real input value returns true (caught elsewhere)', () => {
  expect(isTimeProper('', undefined)).toBe(true);
});

test('Missing expected input value returns true (untouched field in edit mode)', () => {
  expect(isTimeProper(null, '')).toBe(true);
});

test.each([
  ['13:30', '13:30'],
  ['3:30', '3:30'],
  ['3:30 AM', '3:30 AM'],
  ['03:30 AM', '03:30 AM'],
  ['3:30 PM', '3:30 PM'],
  ['03:30 PM', '03:30 PM'],
])('Proper matches return true', (fieldValue, inputValue) => {
  expect(isTimeProper(fieldValue, inputValue)).toBe(true);
});

test.each([
  ['13:30', '13:30z'],
  ['3:30', '3:3'],
  ['3:30AM', '3:30 AM'],
  ['03:30 AM', '03:30 A'],
  ['3:30 PM', '3:30 P'],
  ['03:30 PM', '03:30 pM'],
])('Invalid matches return false', (fieldValue, inputValue) => {
  expect(isTimeProper(fieldValue, inputValue)).toBe(false);
});
