import { faker } from '@bigtest/mirage';
import { formatDateString } from './helpers/messageConverters';

const startDateFuture = formatDateString(faker.date.future(0.1).toString());
const startDatePast = formatDateString(faker.date.past().toString());
const endDate = formatDateString(faker.date.future(0.1, startDateFuture).toString());
const name = 'test';
const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

export {
  startDateFuture,
  startDatePast,
  tomorrow,
  endDate,
  name,
};
