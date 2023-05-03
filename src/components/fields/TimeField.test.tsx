import { render, screen } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import '../../test/__mocks__/matchMedia.mock';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import TimeField from './TimeField';

test('TimeField with display=false does not render', () => {
  render(
    withIntlConfiguration(
      <Form
        onSubmit={() => ({})}
        render={() => {
          return <TimeField display={false} name="foo" />;
        }}
      />,
      'en-US',
      'CET'
    )
  );
  expect(screen.queryByRole('textbox')).toBeNull();
});

test('TimeField renders as local time', async () => {
  render(
    withIntlConfiguration(
      <Form
        onSubmit={() => ({})}
        initialValues={{ foo: '05:00:00Z' }}
        render={() => {
          return <TimeField display name="foo" />;
        }}
      />,
      'en-US',
      'CET'
    )
  );
  expect(screen.getByRole('textbox')).toHaveValue('5:00 AM');
});
