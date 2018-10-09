import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import ServicePointDetails from './ServicePointDetails';
import ErrorBoundary from '../ErrorBoundary';
import CloneSettings from './CloneSettings';

class LibraryHours extends React.Component {
    static manifest = Object.freeze({
      entries: {
        type: 'okapi',
        records: 'servicepoints',
        path: 'service-points',
      },
      query: {},
      periodId: {},
      periods: {
        type: 'okapi',
        records: 'openingPeriods',
        path: 'calendar/periods/%{query}/period?withOpeningDays=true&showPast=true&showExceptional=false',
        fetch: false,
        accumulate: true,
        POST: {
          path: 'calendar/periods/%{query}/period',
        },
        DELETE: {
          path: 'calendar/periods/%{query}/period/%{periodId}',
        },
        PUT: {
          path: 'calendar/periods/%{query}/period/%{periodId}',
        }
      }
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
      if (sortedList !== undefined && sortedList !== null) {
        for (let i = 0; i < sortedList.length; i++) {
          sortedList[i].allEntries = sortBy((this.props.resources.entries || {}).records || [], ['name']);
        }
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
    })
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
    periodId: PropTypes.shape({
      replace: PropTypes.func,
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    intl: PropTypes.object.isRequired,
  }),
};


export default LibraryHours;
