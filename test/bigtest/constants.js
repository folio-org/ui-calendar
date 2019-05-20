import { faker } from '@bigtest/mirage';
import { formatDateString } from './helpers/messageConverters';

export const startDateFuture = formatDateString(faker.date.future(0.1).toString());
export const startDatePast = formatDateString(faker.date.past().toString());
export const endDate = formatDateString(faker.date.future(0.1, startDateFuture).toString());
export const name = 'test';
