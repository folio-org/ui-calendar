import dayjs from '../../utils/dayjs';

export const JAN_1_0730 = dayjs('2000-01-01T07:30').utc(true);
export const JAN_1_0730_DATE = new Date(2000, 0, 1, 7, 30);

export const FEB_1_0000 = dayjs('2000-02-01T00:00').utc(true);
export const FEB_1_0000_DATE = new Date(2000, 1, 1, 0, 0);

export const MAY_14_1507 = dayjs('2000-05-14T15:07').utc(true);
export const MAY_14_1507_DATE = new Date(2000, 4, 14, 15, 7);

export const DEC_31_2359 = dayjs('2000-12-31T23:59').utc(true);
export const DEC_31_2359_DATE = new Date(2000, 11, 31, 23, 59);

export const DEC_1_1231_2001 = dayjs('2001-12-01T12:31').utc(true);
export const DEC_1_1231_2001_DATE = new Date(2001, 11, 1, 12, 31);

/* Times */

export const TIME_0000 = dayjs('00:00').utc(true);
export const TIME_0000_DATE = new Date(0, 0, 0, 0, 0);

export const TIME_0730 = dayjs('07:30').utc(true);
export const TIME_0730_DATE = new Date(0, 0, 0, 7, 30);

export const TIME_1231 = dayjs('12:31').utc(true);
export const TIME_1231_DATE = new Date(0, 0, 0, 12, 31);

export const TIME_1507 = dayjs('23:59').utc(true);
export const TIME_1507_DATE = new Date(0, 0, 0, 15, 7);

export const TIME_2359 = dayjs('23:59').utc(true);
export const TIME_2359_DATE = new Date(0, 0, 0, 23, 59);
