import {
  Factory,
  faker,
} from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  servicePointId: () => faker.random.uuid(),
  name: () => faker.company.catchPhrase(),
  startDate: () => faker.date.future(),
  endDate: () => faker.date.future(),
  openingDays: [],
  openingDay: {},
});
