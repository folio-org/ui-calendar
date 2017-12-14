import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import moment from 'moment';
import packageInfo from '../package';
import AddOpeningDayForm from './AddOpeningDayForm';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  /* {
    label: 'Status',
    name: 'active',
    cql: 'active',
    values: [
      { name: 'Active', cql: 'true' },
      { name: 'Inactive', cql: 'false' },
    ],
  },
  {
    label: 'Patron group',
    name: 'pg',
    cql: 'patronGroup',
    values: [], // will be filled in by componentWillUpdate
  },*/
];

function padNumber(param) {
  return (param > 9) ? param : `0${param}`;
}

class CalendarEvents extends React.Component {
  static propTypes = {
    dateFormat: PropTypes.string,
    resources: PropTypes.shape({
      calendarEventDescription: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      calendarEventDescription: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
    }).isRequired,
    onSelectRow: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
  };

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'startDate',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'descriptions',
      path: 'calendar/eventdescriptions',
    },
  });

  constructor(props) {
    super(props);
    this.dateFormat = props.dateFormat || 'YYYY-MM-DD';
  }

  render() {
    const { resources, mutator, onSelectRow, disableRecordCreation } = this.props;
    const calendarFormatter = {
      'Start date': item => `${moment(item.startDate).format(this.dateFormat)}`,
      'End date': item => `${moment(item.endDate).format(this.dateFormat)}`,
      'Start hour': item => `${padNumber(item.startHour)}:${padNumber(item.startMinute)}`,
      'End hour': item => `${padNumber(item.endHour)}:${padNumber(item.endMinute)}`,
    };

    const initialPath = (_.get(packageInfo, ['stripes', 'home']) ||
                         _.get(packageInfo, ['stripes', 'route']));

    return (
      <SearchAndSort
        moduleName={packageInfo.name.replace(/.*\//, '')}
        moduleTitle={packageInfo.stripes.displayName}
        objectName="calendarEvent"
        baseRoute={packageInfo.stripes.route}
        initialPath={initialPath}
        filterConfig={filterConfig}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        viewRecordComponent={AddOpeningDayForm}
        editRecordComponent={AddOpeningDayForm}
        newRecordInitialValues={{ }}
        visibleColumns={['Start date', 'End date', 'Start hour', 'End hour']}
        resultsFormatter={calendarFormatter}
        onSelectRow={onSelectRow}
        onCreate={this.create}
        massageNewRecord={this.massageNewRecord}
        finishedResourceName="perms"
        viewRecordPerms="calendar.collection.get"
        newRecordPerms="calendar.collection.post"
        disableRecordCreation={disableRecordCreation}
        parentResources={resources}
        parentMutator={mutator}
      />
    );
  }

}

export default CalendarEvents;
