import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  name: () => faker.company.catchPhrase(),
  code: () => faker.company.catchPhrase(),
  discoveryDisplayName: () => faker.company.catchPhrase(),
  pickupLocation:  true,
  holdShelfExpiryPeriod: {
    duration: 2,
    intervalId: 'Days',
  },
});
