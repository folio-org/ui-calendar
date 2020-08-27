import React from 'react';

import { moment } from './settings/constants';

class CalendarUtils extends React.Component {
  static convertNewPeriodToValidBackendPeriod(period, event) {
    const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    let weekDay = 8;
    let openingHour = [];
    let sortedEvents = [];
    if (event) {
      sortedEvents = event.sort((a, b) => {
        return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
      });
    }
    for (let i = 0; i < sortedEvents.length; i++) {
      const dayOpening = sortedEvents[i];
      if (dayOpening.start instanceof moment) {
        dayOpening.start = moment(dayOpening.start).toDate();
        dayOpening.end = moment(dayOpening.end).toDate();
      }
      if (weekDay !== dayOpening.start.getDay()) {
        weekDay = dayOpening.start.getDay();
        openingHour = [];
        if (dayOpening.allDay) {
          period.openingDays.push({
            weekdays: {
              day: weekDays[weekDay],
            },
            openingDay: {
              allDay: dayOpening.allDay,
              open: true
            }
          });
        } else {
          period.openingDays.push({
            weekdays: {
              day: weekDays[weekDay],
            },
            openingDay: {
              openingHour,
              allDay: dayOpening.allDay,
              open: true
            }
          });
        }
      }
      const resultStartHour = moment(dayOpening.start).get('hour');
      const resultStartMinute = moment(dayOpening.start).get('minute');
      const resultEndHour = moment(dayOpening.end).get('hour');
      const resultEndMinute = moment(dayOpening.end).get('minute');

      let finalStartHour;
      let finalStartMinute;
      let finalEndHour;
      let finalEndMinute;

      if (resultStartHour < 10) {
        finalStartHour = `0${resultStartHour}`;
      } else {
        finalStartHour = resultStartHour;
      }
      if (resultStartMinute < 10) {
        finalStartMinute = `0${resultStartMinute}`;
      } else {
        finalStartMinute = resultStartMinute;
      }
      if (resultEndHour < 10) {
        finalEndHour = `0${resultEndHour}`;
      } else {
        finalEndHour = resultEndHour;
      }
      if (resultEndMinute < 10) {
        finalEndMinute = `0${resultEndMinute}`;
      } else {
        finalEndMinute = resultEndMinute;
      }


      openingHour.push({
        startTime: finalStartHour + ':' + finalStartMinute,
        endTime: finalEndHour + ':' + finalEndMinute
      });
    }
    return period;
  }
}

export default CalendarUtils;
