import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import ServicePointDetails from './ServicePointDetails';
import ErrorBoundary from '../ErrorBoundary';
import CloneSettings from './CloneSettings';

import { MAX_RECORDS } from './constants';

class LibraryHours extends React.Component {
    static manifest = Object.freeze({
      entries: {
        type: 'okapi',
        records: 'servicepoints',
        perRequest: 100,
        path: 'service-points',
        params: {
          query: 'cql.allRecords=1',
          limit: MAX_RECORDS,
        },
      },
      query: {},
      periodId: {},
      exceptional: {},
      periods: {
        type: 'okapi',
        records: 'openingPeriods',
        path: 'calendar/periods/%{query}/period?withOpeningDays=true&showPast=true&showExceptional=%{exceptional}',
        fetch: false,
        throwErrors: false,
        accumulate: true,
        POST: {
          path: 'calendar/periods/%{query}/period',
        },
        DELETE: {
          path: 'calendar/periods/%{query}/period/%{periodId}',
        },
        PUT: {
          path: 'calendar/periods/%{query}/period/%{periodId}',
        },
      },
    });

    constructor() {
      super();
      this.onChildToggle = this.onChildToggle.bind(this);
      this.state = {
        toggleCloneSettings: false,
      };
    }


    onChildToggle(isOpen) {
      this.setState({ toggleCloneSettings: isOpen });
    }


    render() {
      const { toggleCloneSettings } = this.state;
      const that = this;
      let renderedCloneSettings = null;
      if (toggleCloneSettings) {
        renderedCloneSettings = <CloneSettings {...this.props} onToggle={that.onChildToggle()} />;
      }
      const sortedList = sortBy((this.props.resources.entries || {}).records || [], ['name']);

      for (let i = 0; i < sortedList.length; i++) {
        sortedList[i].allEntries = sortedList;
      }

      return (
        <ErrorBoundary>
          <EntryManager
            {...this.props}
            paneTitle={this.props.label}
            entryList={sortedList}
            detailComponent={ServicePointDetails}
            entryFormComponent={() => ({})}
            entryLabel={this.props.label}
            nameKey="name"
            parentMutator={this.props.mutator}
            permissions={{
              put: 'settings.calendar.disabled',
              post: 'settings.calendar.disabled',
              delete: 'settings.calendar.disabled',
            }}
            editable={false}
          />
          {renderedCloneSettings}
        </ErrorBoundary>
      );
    }
}

LibraryHours.propTypes = {
  label: PropTypes.string.isRequired,
  resources: PropTypes.shape({
    entries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    periods: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    entries: PropTypes.shape({
      GET: PropTypes.func,
    }),
    periods: PropTypes.shape({
      reset: PropTypes.func,
      GET: PropTypes.func,
      POST: PropTypes.func,
      DELETE: PropTypes.func,
    }),
    query: PropTypes.shape({
      replace: PropTypes.func,
    }),
    exceptional: PropTypes.shape({
      replace: PropTypes.func,
    }),
    periodId: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }).isRequired,
};


export default LibraryHours;
