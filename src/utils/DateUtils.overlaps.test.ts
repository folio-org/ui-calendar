import { overlaps } from './DateUtils';
import * as Dates from '../test/data/Dates';

test('Distinct multi-day ranges do not overlap', () => {
  expect(overlaps(Dates.JAN_1, Dates.FEB_1, Dates.MAY_1, Dates.DEC_1)).toBe(
    false
  );
  expect(overlaps(Dates.MAY_1, Dates.DEC_1, Dates.JAN_1, Dates.FEB_1)).toBe(
    false
  );

  expect(overlaps(Dates.MAY_1, Dates.MAY_2, Dates.MAY_3, Dates.MAY_4)).toBe(
    false
  );
  expect(overlaps(Dates.MAY_3, Dates.MAY_4, Dates.MAY_1, Dates.MAY_2)).toBe(
    false
  );
});

test('Distinct single-day ranges do not overlap', () => {
  expect(overlaps(Dates.JAN_1, Dates.JAN_1, Dates.DEC_1, Dates.DEC_1)).toBe(
    false
  );
  expect(overlaps(Dates.DEC_1, Dates.DEC_1, Dates.JAN_1, Dates.JAN_1)).toBe(
    false
  );

  expect(overlaps(Dates.MAY_2, Dates.MAY_2, Dates.MAY_3, Dates.MAY_3)).toBe(
    false
  );
  expect(overlaps(Dates.MAY_3, Dates.MAY_3, Dates.MAY_2, Dates.MAY_2)).toBe(
    false
  );
});

test('Distinct single-day overlaps', () => {
  expect(overlaps(Dates.JAN_1, Dates.DEC_1, Dates.MAY_1, Dates.MAY_1)).toBe(
    true
  );
  expect(overlaps(Dates.MAY_1, Dates.MAY_1, Dates.JAN_1, Dates.DEC_1)).toBe(
    true
  );

  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_1, Dates.MAY_1)).toBe(
    true
  );
  expect(overlaps(Dates.MAY_1, Dates.MAY_1, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );

  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_7, Dates.MAY_7)).toBe(
    true
  );
  expect(overlaps(Dates.MAY_7, Dates.MAY_7, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );

  expect(overlaps(Dates.JAN_1, Dates.JAN_1, Dates.JAN_1, Dates.JAN_1)).toBe(
    true
  );
});

test('Overlapping multi-day ranges overlap', () => {
  // parameters are A,B,C,D

  // identical AB=CD (-A=C-B=D-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );

  // AB inside CD (-C-A-B-D-)
  expect(overlaps(Dates.MAY_3, Dates.MAY_4, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );
  // AB outside CD (-A-C-D-B-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_3, Dates.MAY_4)).toBe(
    true
  );

  // AB starts with and ends after CD (-A=C-D-B-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_1, Dates.MAY_4)).toBe(
    true
  );
  // AB starts with and ends before CD (-A=C-B-D-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_4, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );

  // AB ends with and starts after CD (-C-A-B=D-)
  expect(overlaps(Dates.MAY_4, Dates.MAY_7, Dates.MAY_1, Dates.MAY_7)).toBe(
    true
  );
  // AB ends with and starts before CD (-A-C-B=D-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_7, Dates.MAY_4, Dates.MAY_7)).toBe(
    true
  );

  // AB overlaps only the start of CD (-A-B=C-D-)
  expect(overlaps(Dates.MAY_1, Dates.MAY_4, Dates.MAY_4, Dates.MAY_7)).toBe(
    true
  );
  // AB overlaps only the end of CD (-C-D=A-B-)
  expect(overlaps(Dates.MAY_4, Dates.MAY_7, Dates.MAY_1, Dates.MAY_4)).toBe(
    true
  );
});
