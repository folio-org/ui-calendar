import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormValues } from '../../forms/CalendarForm/types';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import ExceptionField from './ExceptionField';
import { ExceptionRowState } from './ExceptionFieldTypes';
import RowType from './RowType';

describe('ExceptionField', () => {
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
            <FieldArray<ExceptionRowState> name="exceptions">
              {({ fields: values }) => <ExceptionField values={values} />}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('Rows add successfully', async () => {
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
        >
          {() => (
            <FieldArray<ExceptionRowState> name="exceptions">
              {({ fields: values }) => <ExceptionField values={values} />}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Add row' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('Field with values renders successfully', () => {
    render(
      withIntlConfiguration(
        <Form<FormValues>
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
          initialValues={{
            exceptions: [
              {
                name: 'test',
                type: RowType.Open,
                rows: [
                  {
                    startDate: '2000-01-01',
                    startTime: '00:00',
                    endDate: '2000-01-01',
                    endTime: '00:00',
                  },
                ],
              },
            ],
          }}
        >
          {() => (
            <FieldArray<ExceptionRowState> name="exceptions">
              {({ fields: values }) => <ExceptionField values={values} />}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('Adding and deleting rows works successfully', async () => {
    render(
      withIntlConfiguration(
        <Form<FormValues>
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
          initialValues={{
            exceptions: [
              {
                name: 'test',
                type: RowType.Open,
                rows: [
                  {
                    startDate: '2000-01-01',
                    startTime: '00:00',
                    endDate: '2000-01-01',
                    endTime: '00:00',
                  },
                ],
              },
            ],
          }}
        >
          {() => (
            <FieldArray<ExceptionRowState> name="exceptions">
              {({ fields: values }) => <ExceptionField values={values} />}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(5);

    await userEvent.click(screen.getByRole('button', { name: 'plus-sign' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(9);

    await userEvent.click(screen.getByRole('button', { name: 'trash' }));
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.findAllByRole('textbox')).toHaveLength(0);
  });

  it('Adding to closed rows is a no-op', async () => {
    render(
      withIntlConfiguration(
        <Form<FormValues>
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={() => ({})}
          initialValues={{
            exceptions: [
              {
                name: 'test',
                type: RowType.Closed,
                rows: [
                  {
                    startDate: '2000-01-01',
                    startTime: undefined,
                    endDate: '2000-01-01',
                    endTime: undefined,
                  },
                ],
              },
            ],
          }}
        >
          {() => (
            <FieldArray<ExceptionRowState> name="exceptions">
              {({ fields: values }) => <ExceptionField values={values} />}
            </FieldArray>
          )}
        </Form>
      )
    );

    // header and add row button
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(3);

    await userEvent.click(screen.getByRole('button', { name: 'plus-sign' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
  });
});
