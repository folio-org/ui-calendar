import {
  collection,
  interactor
} from '@bigtest/interactor';
import simulateClick from '../helpers/simulateClick';

export default @interactor class BigCalendar {
  defaultScope = '[data-test-big-calendar-wrapper]';

  wholeDay = collection('.rbc-day-bg');
  timeSlots = collection('.rbc-time-slot');
  events = collection('.rbc-event-content');
  eventLabels = collection('.rbc-event-label');

  simulateClick(startElem, endElem) {
    simulateClick(startElem, endElem);
  }
}
