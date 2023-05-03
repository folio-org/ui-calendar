import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import '../../test/__mocks__/matchMedia.mock';
import ServicePoints from '../../test/data/ServicePoints';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import ServicePointAssignmentField from './ServicePointAssignmentField';

test('ServicePointAssignmentField sorting and filtering works as expected', async () => {
  render(
    withIntlConfiguration(
      <Form
        onSubmit={() => ({})}
        render={() => {
          return <ServicePointAssignmentField servicePoints={ServicePoints} />;
        }}
      />
    )
  );
  expect(screen.getByText('Service points')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('textbox'));
  expect(
    screen.getByRole('option', { name: 'Service point 1 +' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('option', { name: 'Service point 2 +' })
  ).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Online +' })).toBeInTheDocument();

  await userEvent.type(screen.getByRole('textbox'), 'sp1');
  expect(screen.queryByRole('option', { name: 'Online +' })).toBeNull();
  // looks like this due to the highlighting
  expect(
    screen.getByRole('option', { name: 'S ervice p oint 1 +' })
  ).toBeInTheDocument();

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(screen.getByRole('textbox'), 'sp');
  expect(
    screen.getByRole('option', { name: 'S ervice p oint 1 +' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('option', { name: 'S ervice p oint 2 +' })
  ).toBeInTheDocument();

  // both SP1 and SP2 have same quality match, so should sort lexicographically
  expect(
    screen
      .getByRole('option', { name: 'S ervice p oint 1 +' })
      .compareDocumentPosition(
        screen.getByRole('option', { name: 'S ervice p oint 2 +' })
      )
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(
    screen.getByRole('textbox'),
    'this does not match anything!'
  );
  expect(screen.queryAllByRole('option')).toHaveLength(0);

  await userEvent.clear(screen.getByRole('textbox'));
  // matches online and service point, but online better
  await userEvent.type(screen.getByRole('textbox'), 'on');
  expect(
    screen.getByRole('option', { name: 'Service p o i n t 1 +' })
  ).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'On line +' })).toBeInTheDocument();
  // online is a better match, so should appear first
  expect(
    screen
      .getByRole('option', { name: 'On line +' })
      .compareDocumentPosition(
        screen.getByRole('option', { name: 'Service p o i n t 1 +' })
      )
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});
