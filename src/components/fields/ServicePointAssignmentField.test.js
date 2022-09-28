import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import '../../test/__mocks__/matchMedia.mock';
import ServicePointAssignmentField from './ServicePointAssignmentField';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';

const servicePoints = [
  {
    'id': 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
    'name': 'Circ Desk 2',
    'inactive': false
  },
  {
    'id': '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
    'name': 'Circ Desk 1',
    'inactive': false
  }
];

describe('ServicePointAssignmentField', () => {
  it('should render ServicePointAssignmentField', () => {
    render(withIntlConfiguration(
      <Form
        onSubmit={jest.fn()}
        render={() => {
          return (
            <form onSubmit={jest.fn()}>
              <ServicePointAssignmentField servicePoints={servicePoints} />
            </form>
          );
        }
        }
      />
    ));
    expect(screen.getByText('Service points')).toBeInTheDocument();
  });
});
