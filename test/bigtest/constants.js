import faker from 'faker';
import { formatDateString } from './helpers/messageConverters';

const startDateFuture = formatDateString(faker.date.future(0.1).toString());
const startDatePast = formatDateString(faker.date.past().toString());
const endDate = formatDateString(faker.date.future(0.1, startDateFuture).toString());
const name = 'test';
const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
const startTime = '04:04 PM';
const endTime = '04:04 AM';

export {
  startDateFuture,
  startDatePast,
  startTime,
  endTime,
  tomorrow,
  endDate,
  name,
};
