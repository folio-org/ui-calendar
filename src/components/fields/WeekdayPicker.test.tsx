import { render, screen } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import { WEEKDAYS } from '../../utils/WeekdayUtils';
import WeekdayPicker from './WeekdayPicker';

test('WeekdayPicker contains locale weekdays', async () => {
  render(
    withIntlConfiguration(
      <Form
        onSubmit={() => ({})}
        initialValues={{ foo: WEEKDAYS.FRIDAY }}
        render={() => {
          return <WeekdayPicker ariaLabel="funky chicken" name="foo" />;
        }}
      />,
      'fr-FR'
    )
  );

  expect(screen.getByRole('option', { name: 'lundi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'mardi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'mercredi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'jeudi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'vendredi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'samedi' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'dimanche' })).toBeInTheDocument();
});
