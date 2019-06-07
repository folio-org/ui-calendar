import {
  collection,
  interactor
} from '@bigtest/interactor';
import createBigCalendarEvent from '../helpers/createBigCalendarEvent';

export default @interactor class BigCalendar {
  defaultScope = '[data-test-big-calendar-wrapper]';

  wholeDay = collection('.rbc-day-bg');
  timeSlots = collection('.rbc-timeslot-group');
  events = collection('.rbc-event-dates-content');

  createEvent(startElem, endElem) {
    createBigCalendarEvent(startElem, endElem);
  }
}
