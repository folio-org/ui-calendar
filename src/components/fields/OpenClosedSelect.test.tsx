import { render, screen } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import OpenClosedSelect from './OpenClosedSelect';
import RowType from './RowType';

describe('OpenClosedSelect', () => {
  it('includes open', () => {
    render(
      withIntlConfiguration(
        <Form onSubmit={() => ({})} initialValues={{ foo: RowType.Open }}>
          {() => <OpenClosedSelect name="foo" />}
        </Form>
      )
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('includes closed', () => {
    render(
      withIntlConfiguration(
        <Form onSubmit={() => ({})} initialValues={{ foo: RowType.Closed }}>
          {() => <OpenClosedSelect name="foo" />}
        </Form>
      )
    );

    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});
