import {
  MultiSelection,
  MultiSelectionFieldRenderProps,
  OptionSegment
} from '@folio/stripes/components';
import fuzzysort from 'fuzzysort';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { ServicePoint } from '../../types/types';

interface ServicePointAssignmentFieldProps {
  servicePoints: ServicePoint[];
  error: ReactNode | undefined;
}

const ServicePointAssignmentField: FunctionComponent<
  ServicePointAssignmentFieldProps
> = (props: ServicePointAssignmentFieldProps) => {
  const formatter = ({
    option,
    searchTerm
  }: {
    option: ServicePoint;
    searchTerm: string | undefined;
  }) => {
    if (typeof searchTerm !== 'string' || searchTerm === '') {
      return <OptionSegment>{option.name}</OptionSegment>;
    }

    const result = fuzzysort.single(searchTerm, option.name);

    // this should not happen as all elements passed to this function should have been found
    if (result === null) return null;

    return (
      <OptionSegment key={option.id}>
        {fuzzysort.highlight(result, (m, i) => (
          <strong key={i}>{m}</strong>
        ))}
      </OptionSegment>
    );
  };

  return (
    <Field
      name="service-points"
      component={
        MultiSelection<
          ServicePoint,
          MultiSelectionFieldRenderProps<ServicePoint>
        >
      }
      label={
        <FormattedMessage id="ui-calendar.calendarForm.field.servicePoints" />
      }
      formatter={formatter}
      filter={(filterText: string | undefined, list: ServicePoint[]) => {
        if (typeof filterText !== 'string' || filterText === '') {
          return { renderedItems: list, exactMatch: false };
        }

        // must spread and re-collect into a new array, as the returned array is immutable
        const results = [
          ...fuzzysort.go(filterText, props.servicePoints, { key: 'name' })
        ];

        // score descending, then name ascending
        // fixes "service point 1".."service point 4" etc having undefined order
        results.sort((a, b) => {
          if (a.score === b.score) {
            return a.target.localeCompare(b.target);
          }
          return -(a.score - b.score);
        });

        return {
          // retrieve the original service point
          renderedItems: results.map((result) => result.obj),
          exactMatch: !!list.filter((sp) => sp.name === filterText).length
        };
      }}
      itemToString={(servicePoint: ServicePoint | undefined) => {
        if (typeof servicePoint === 'object' && servicePoint !== null) {
          return servicePoint.name;
        } else {
          return '';
        }
      }}
      dataOptions={props.servicePoints}
      error={props.error}
    />
  );
};

export default ServicePointAssignmentField;
