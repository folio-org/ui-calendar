import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import HoursOfOperationField from './HoursOfOperationField';
import { HoursOfOperationRowState } from './HoursOfOperationFieldTypes';

describe('HoursOfOperationField', () => {
  it('Empty field renders successfully', () => {
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
        >
          {() => (
            <FieldArray<HoursOfOperationRowState> name="hours-of-operation">
              {({ fields: values }) => (
                <HoursOfOperationField values={values} />
              )}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('Rows add and remove successfully', async () => {
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
        >
          {() => (
            <FieldArray<HoursOfOperationRowState> name="hours-of-operation">
              {({ fields: values }) => (
                <HoursOfOperationField values={values} />
              )}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'trash' }));
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});
