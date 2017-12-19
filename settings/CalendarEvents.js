import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import moment from 'moment';
import AddOpeningDayForm from './AddOpeningDayForm';
import ViewOpeningDay from './ViewOpeningDay';

function padNumber(param) {
  return (param > 9) ? param : `0${param}`;
}

class CalendarEvents extends React.Component {
  static propTypes = {
    dateFormat: PropTypes.string,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        GET: PropTypes.func,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'descriptions',
      path: 'calendar/eventdescriptions',
      POST: {
        path: 'calendar/eventdescriptions',
      },
    },
  });

  constructor(props) {
    super(props);
    this.dateFormat = props.dateFormat || 'YYYY-MM-DD';
  }

  render() {
    const calendarFormatter = {
      'Start date': item => `${moment(item.startDate).format(this.dateFormat)}`,
      'End date': item => `${moment(item.endDate).format(this.dateFormat)}`,
      'Start hour': item => `${padNumber(item.startHour)}:${padNumber(item.startMinute)}`,
      'End hour': item => `${padNumber(item.endHour)}:${padNumber(item.endMinute)}`,
    };

    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={_.sortBy((this.props.resources.entries || {}).records || [], ['startDate'])}
        detailComponent={ViewOpeningDay}
        formComponent={AddOpeningDayForm}
        paneTitle="Opening days"
        entryLabel="Opening day"
        nameKey="startDate"
        permissions={{
          post: '',
          put: '',
          delete: '',
        }}
        defaultEntry={{ daysIncluded: {} }}
      />
    );
  }

}

export default CalendarEvents;
