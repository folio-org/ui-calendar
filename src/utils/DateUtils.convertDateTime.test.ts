import * as Dates from '../test/data/Dates';
import * as DateTimes from '../test/data/DateTimes';
import {
  dateFromYYYYMMDDAndHHMM,
  dateFromDateAndHHMM,
  dateFromHHMM,
  dateToTimeOnly
} from './DateUtils';

test('dateFromYYYYMMDDAndHHMM comparison works as expected', () => {
  expect(dateFromYYYYMMDDAndHHMM('2000-02-01', '00:00')).toStrictEqual(
    DateTimes.FEB_1_0000_DATE
  );

  expect(dateFromYYYYMMDDAndHHMM('2000-01-01', '07:30')).toStrictEqual(
    DateTimes.JAN_1_0730_DATE
  );

  expect(dateFromYYYYMMDDAndHHMM('2001-12-01', '12:31')).toStrictEqual(
    DateTimes.DEC_1_1231_2001_DATE
  );

  expect(dateFromYYYYMMDDAndHHMM('2000-5-14', '15:07')).toStrictEqual(
    DateTimes.MAY_14_1507_DATE
  );

  expect(dateFromYYYYMMDDAndHHMM('2000-12-31', '23:59')).toStrictEqual(
    DateTimes.DEC_31_2359_DATE
  );
});

test('dateFromDateAndHHMM comparison works as expected', () => {
  expect(dateFromDateAndHHMM(Dates.FEB_1_DATE, '00:00')).toStrictEqual(
    DateTimes.FEB_1_0000_DATE
  );

  expect(dateFromDateAndHHMM(Dates.JAN_1_DATE, '07:30')).toStrictEqual(
    DateTimes.JAN_1_0730_DATE
  );

  expect(dateFromDateAndHHMM(Dates.DEC_1_2001_DATE, '12:31')).toStrictEqual(
    DateTimes.DEC_1_1231_2001_DATE
  );

  expect(dateFromDateAndHHMM(Dates.MAY_14_DATE, '15:07')).toStrictEqual(
    DateTimes.MAY_14_1507_DATE
  );

  expect(dateFromDateAndHHMM(Dates.DEC_31_DATE, '23:59')).toStrictEqual(
    DateTimes.DEC_31_2359_DATE
  );
});

test('dateFromHHMM comparison works as expected', () => {
  expect(dateFromHHMM('00:00')).toStrictEqual(DateTimes.TIME_0000_DATE);
  expect(dateFromHHMM('07:30')).toStrictEqual(DateTimes.TIME_0730_DATE);
  expect(dateFromHHMM('12:31')).toStrictEqual(DateTimes.TIME_1231_DATE);
  expect(dateFromHHMM('15:07')).toStrictEqual(DateTimes.TIME_1507_DATE);
  expect(dateFromHHMM('23:59')).toStrictEqual(DateTimes.TIME_2359_DATE);
});

test('dateToTimeOnly comparison works as expected', () => {
  expect(dateToTimeOnly(DateTimes.FEB_1_0000_DATE)).toStrictEqual(
    DateTimes.TIME_0000_DATE
  );
  expect(dateToTimeOnly(DateTimes.JAN_1_0730_DATE)).toStrictEqual(
    DateTimes.TIME_0730_DATE
  );
  expect(dateToTimeOnly(DateTimes.DEC_1_1231_2001_DATE)).toStrictEqual(
    DateTimes.TIME_1231_DATE
  );
  expect(dateToTimeOnly(DateTimes.MAY_14_1507_DATE)).toStrictEqual(
    DateTimes.TIME_1507_DATE
  );
  expect(dateToTimeOnly(DateTimes.DEC_31_2359_DATE)).toStrictEqual(
    DateTimes.TIME_2359_DATE
  );
});
