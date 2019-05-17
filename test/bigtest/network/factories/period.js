import {
  Factory,
  faker,
} from '@bigtest/mirage';

export default Factory.extend({
  id: () => faker.random.uuid(),
  servicePointId: () => faker.random.uuid(),
  name: () => faker.company.catchPhrase(),
  startDate: () => faker.date.future(0.1).toString(),
  endDate: () => faker.date.future(0.1, faker.date.future(0.1)).toString(),
  openingDays: [],
  openingDay: {},
});
