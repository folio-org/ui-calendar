import faker from 'faker';
import { formatDateString, formatDisplayDateString } from './helpers/messageConverters';

const future = faker.date.future(0.1).toString();
const startDateFuture = formatDateString(future);
const startDisplayDateFuture = formatDisplayDateString(future);

const past = faker.date.past().toString();
const startDatePast = formatDateString(past);
const startDisplayDatePast = formatDisplayDateString(past);

const end = faker.date.future(0.1, startDateFuture).toString();
const endDate = formatDateString(end);
const endDisplayDate = formatDisplayDateString(end);

const name = 'test';
const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
const startTime = '04:04 PM';
const endTime = '04:04 AM';

export {
  startDateFuture,
  startDisplayDateFuture,
  startDatePast,
  startDisplayDatePast,
  startTime,
  endTime,
  tomorrow,
  endDate,
  endDisplayDate,
  name,
};
