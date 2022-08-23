import { IntlShape } from 'react-intl';
import Permissions from './permissions';
import getIntl from '../test/util/getIntl';

let intl: IntlShape;

beforeAll(() => {
  intl = getIntl();
});

test('Permissions are valid', () => {
  expect(
    intl.formatMessage({
      id: Permissions.VIEW.replace('ui-calendar', 'ui-calendar.permission'),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.CREATE.replace('ui-calendar', 'ui-calendar.permission'),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.UPDATE.replace('ui-calendar', 'ui-calendar.permission'),
    })
  ).toMatch(/^Settings \(Calendar\)/);
  expect(
    intl.formatMessage({
      id: Permissions.DELETE.replace('ui-calendar', 'ui-calendar.permission'),
    })
  ).toMatch(/^Settings \(Calendar\)/);
});
