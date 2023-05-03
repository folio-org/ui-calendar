import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form } from 'react-final-form';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import OpenClosedSelectExceptional from './OpenClosedSelectExceptional';
import RowType from './RowType';

describe('Exceptional dropdown should remove extra rows when going open to closed', () => {
  it('Changing to closed removes extra rows', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: ['val1', 'val2', 'val3'],
            select: RowType.Open,
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OpenClosedSelectExceptional name="select" rowsName="testArray" />
              <button type="submit">submit</button>
            </form>
          )}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Closed' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toStrictEqual(['val1']);
  });

  it('Changing to open does nothing', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: ['val1'],
            select: RowType.Closed,
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OpenClosedSelectExceptional name="select" rowsName="testArray" />
              <button type="submit">submit</button>
            </form>
          )}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Open' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toStrictEqual(['val1']);
  });

  it('Changing to open with multiple does nothing', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: ['val1', 'val2'],
            select: RowType.Closed,
          }}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <OpenClosedSelectExceptional
                  name="select"
                  rowsName="testArray"
                />
                <button type="submit">submit</button>
              </form>
            );
          }}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Open' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toStrictEqual(['val1']);
  });

  it('Changing to closed with only one item does nothing', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: ['val1'],
            select: RowType.Open,
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OpenClosedSelectExceptional name="select" rowsName="testArray" />
              <button type="submit">submit</button>
            </form>
          )}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Closed' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toStrictEqual(['val1']);
  });

  it('Changing to closed with no items does nothing', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: [],
            select: RowType.Open,
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OpenClosedSelectExceptional name="select" rowsName="testArray" />
              <button type="submit">submit</button>
            </form>
          )}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Closed' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toStrictEqual([]);
  });

  it('Changing to closed with undefined array does nothing', async () => {
    const submitter = jest.fn();
    render(
      withIntlConfiguration(
        <Form
          mutators={{
            ...arrayMutators,
          }}
          onSubmit={submitter}
          initialValues={{
            testArray: 'not-an-array',
            select: RowType.Open,
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <OpenClosedSelectExceptional name="select" rowsName="testArray" />
              <button type="submit">submit</button>
            </form>
          )}
        </Form>
      )
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'Closed' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'submit' }));

    expect(submitter.mock.lastCall[0].testArray).toEqual('not-an-array');
  });
});
