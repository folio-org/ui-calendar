import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  servicePointId: () => faker.random.uuid(),
  name: () => faker.company.catchPhrase(),
  startDate: () => faker.date.future(0.1).toISOString(),
  endDate: () => faker.date.future(0.1, faker.date.future(0.1)).toISOString(),
  openingDays: [],
  openingDay: {},
});
