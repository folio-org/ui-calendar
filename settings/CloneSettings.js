import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Headline, List, Pane } from '@folio/stripes/components';

class CloneSettings extends React.Component {
    static propTypes = {
      onToggle: PropTypes.func.isRequired,
      stripes: PropTypes.shape({
        connect: PropTypes.func.isRequired,
        intl: PropTypes.object.isRequired,
      }).isRequired,
    };

    static manifest = Object.freeze({
      periods: {
        type: 'okapi',
        records: 'periods',
        path: 'service-points',
      },
    });

    constructor() {
      super();
      this.handleClose = this.handleClose.bind(this);
      // this.state = {
      //   sections: {
      //     generalInformation: true,
      //   },
      //   displayCurrentPeriod: {},
      //   displayPeriods: [],
      //   openingPeriod: {
      //     id: '1',
      //     servicePointId: '2',
      //     name: 'Tets period',
      //     startDate: '2018-06-01',
      //     endDate: '2018-06-30',
      //     openingDays: [
      //       {
      //         day: 'MONDAY',
      //         open: false,
      //         allDay: false
      //       }, {
      //         day: 'TUESDAY',
      //         open: true,
      //         allDay: true
      //       }, {
      //         day: 'WEDNESDAY',
      //         open: true,
      //         allDay: false,
      //         openingHour: [{
      //           endTime: '19:45:18.000Z',
      //           startTime: '19:16:18.000Z'
      //         }, {
      //           endTime: '19:14:25.000Z',
      //           startTime: '19:00:25.000Z'
      //         }, {
      //           endTime: '10:02:31.000Z',
      //           startTime: '9:02:31.000Z'
      //         }]
      //       }, { day: 'THURSDAY', open: false, allDay: false }, {
      //         day: 'FRIDAY',
      //         open: true,
      //         allDay: false,
      //         openingHour: [{
      //           endTime: '16:19:20.000Z',
      //           startTime: '12:00:20.000Z'
      //         }]
      //       }, {
      //         day: 'SATURDAY',
      //         open: false,
      //         allDay: false
      //       }, {
      //         day: 'SUNDAY',
      //         open: false,
      //         allDay: false
      //       }]
      //   },
      //   openingPeriods: [
      //     {
      //       id: '1',
      //       servicePointId: '2',
      //       name: 'Tets period',
      //       startDate: '2018-06-01',
      //       endDate: '2018-06-30',
      //       openingDays: [
      //         {
      //           day: 'MONDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'TUESDAY',
      //           open: true,
      //           allDay: true
      //         }, {
      //           day: 'WEDNESDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '19:45:18.000Z',
      //             startTime: '19:16:18.000Z'
      //           }, {
      //             endTime: '19:14:25.000Z',
      //             startTime: '19:00:25.000Z'
      //           }, {
      //             endTime: '10:02:31.000Z',
      //             startTime: '9:02:31.000Z'
      //           }]
      //         }, { day: 'THURSDAY', open: false, allDay: false }, {
      //           day: 'FRIDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '16:19:20.000Z',
      //             startTime: '12:00:20.000Z'
      //           }]
      //         }, {
      //           day: 'SATURDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'SUNDAY',
      //           open: false,
      //           allDay: false
      //         }]
      //     }, {
      //       id: '2',
      //       servicePointId: '2',
      //       name: 'Test period 2',
      //       startDate: '2018-07-01',
      //       endDate: '2018-07-30',
      //       openingDays: [
      //         {
      //           day: 'MONDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'TUESDAY',
      //           open: true,
      //           allDay: true
      //         }, {
      //           day: 'WEDNESDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '19:45:18.000Z',
      //             startTime: '19:16:18.000Z'
      //           }, {
      //             endTime: '19:14:25.000Z',
      //             startTime: '19:00:25.000Z'
      //           }, {
      //             endTime: '10:02:31.000Z',
      //             startTime: '9:02:31.000Z'
      //           }]
      //         }, { day: 'THURSDAY', open: false, allDay: false }, {
      //           day: 'FRIDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '16:19:20.000Z',
      //             startTime: '12:00:20.000Z'
      //           }]
      //         }, {
      //           day: 'SATURDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'SUNDAY',
      //           open: false,
      //           allDay: false
      //         }]
      //     }, {
      //       id: '3',
      //       servicePointId: '2',
      //       name: 'Tets period 3',
      //       startDate: '2018-08-01',
      //       endDate: '2018-08-30',
      //       openingDays: [
      //         {
      //           day: 'MONDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'TUESDAY',
      //           open: true,
      //           allDay: true
      //         }, {
      //           day: 'WEDNESDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '19:45:18.000Z',
      //             startTime: '19:16:18.000Z'
      //           }, {
      //             endTime: '19:14:25.000Z',
      //             startTime: '19:00:25.000Z'
      //           }, {
      //             endTime: '10:02:31.000Z',
      //             startTime: '9:02:31.000Z'
      //           }]
      //         }, { day: 'THURSDAY', open: false, allDay: false }, {
      //           day: 'FRIDAY',
      //           open: true,
      //           allDay: false,
      //           openingHour: [{
      //             endTime: '16:19:20.000Z',
      //             startTime: '12:00:20.000Z'
      //           }]
      //         }, {
      //           day: 'SATURDAY',
      //           open: false,
      //           allDay: false
      //         }, {
      //           day: 'SUNDAY',
      //           open: false,
      //           allDay: false
      //         }]
      //     }
      //   ],
      //   selectedPeriods: [],
      //   selectedServicePoints: [],
      // };
    }


    handleClose() {
      this.props.onToggle(false);
    }


    render() {
      const selectedPeriods = [];
      const selectedServicePoints = [];
      const clonePeriodsFormatter = (item) => (
        <li>
          <Checkbox
            id={item.id}
            onChange={
                    () => {
                      const index = selectedPeriods.indexOf(item.id);
                      if (index > -1) {
                        selectedPeriods.splice(index, 1);
                      } else {
                        selectedPeriods.push(item.id);
                      }
                    }
                }
            label={item.name}
          />
        </li>);
      const cloneServicePointsFormatter = (item) => (
        <li>
          <Checkbox
            id={item.id}
            onChange={() => {
              const index = selectedServicePoints.indexOf(item.id);
              if (index > -1) {
                selectedServicePoints.splice(index, 1);
              } else {
                selectedServicePoints.push(item.id);
              }
            }
                }
            label={item.name}
          />
        </li>);
      return (
        <Pane
          padContent={false}
          dismissible
          defaultWidth="fill"
          height="100%"
          fluidContentWidth
          paneTitle="Clone settings"
          onClose={this.handleClose}
        >
          <Headline size="small" margin="large">Select Period(s) to be copied</Headline>
          <List
            items={this.state.openingPeriods}
            itemFormatter={clonePeriodsFormatter}
          />
          <Headline size="small" margin="large">Select Service Point(s) to copy to</Headline>
          <List
            items={this.state.openingPeriods}
            itemFormatter={cloneServicePointsFormatter}
          />
        </Pane>
      );
    }
}

export default CloneSettings;
