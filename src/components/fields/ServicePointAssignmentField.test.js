import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import '../../test/__mocks__/matchMedia.mock';
import ServicePointAssignmentField from './ServicePointAssignmentField';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import ServicePoints from '../../test/data/ServicePoints';

describe('ServicePointAssignmentField', () => {
  it('should render ServicePointAssignmentField', () => {
    render(withIntlConfiguration(
      <Form
        onSubmit={jest.fn()}
        render={() => {
          return (
            <form onSubmit={jest.fn()}>
              <ServicePointAssignmentField servicePoints={ServicePoints} />
            </form>
          );
        }
        }
      />
    ));
    expect(screen.getByText('Service points')).toBeInTheDocument();
  });
});
