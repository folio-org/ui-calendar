import { including, Link } from '@interactors/html';
import { CYPRESS_TEST_CALENDAR } from '../../data/Calendars';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import Pane from '../interactors/pane';
import { MultiColumnListCell } from '../interactors/multi-column-list';
import Button from '../interactors/button';
import { checkCalendarFields, checkExpandButton, checkMenuAction } from '../support/fragments/calendar-info-pane';

describe('Checking the view of calendar on "All Calendars" tab', () => {
  let testCalendarResponse;

  before(() => {
    // login and open calendar settings
    cy.loginAsAdmin();

    // create test calendar
    cy.createServicePoint(CYPRESS_TEST_SERVICE_POINT, (response) => {
      CYPRESS_TEST_CALENDAR.assignments = [response.body.id];

      cy.createCalendar(CYPRESS_TEST_CALENDAR, (calResponse) => {
        testCalendarResponse = calResponse.body;
      });
    });
  });


  beforeEach(() => {
    cy.openCalendarSettings();
    cy.do(Pane('Calendar').find(Link('All calendars')).click());
  });

  after(() => {
    // delete test calendar
    cy.deleteServicePoint(CYPRESS_TEST_SERVICE_POINT.id);
    cy.deleteCalendar(testCalendarResponse.id);
  });


  it('should check that the appropriate actions menu exists in the "All calendars" tab', () => {
    cy.do([
      Pane('All calendars').find(Button({ className: including('actionMenuToggle') })).click(),
      Button('New').exists(),
      Button('Purge old calendars').exists(),
    ]);
  });

  it('should check that the fields of the calendar exists', () => {
    cy.do(
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name)).click(),
    );
    checkCalendarFields(CYPRESS_TEST_CALENDAR, CYPRESS_TEST_SERVICE_POINT);
  });

  it('should check that the expand/collapse button works correctly', () => {
    cy.do(
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name, { column: 'Calendar name' })).click(),
    );
    checkExpandButton();
  });

  it('should check that the individual calendar tab has the appropriate menu actions', () => {
    cy.do(
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name, { column: 'Calendar name' })).click(),
    );
    checkMenuAction(testCalendarResponse.name);
  });
});
