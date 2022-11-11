import { Link } from '@interactors/html';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import { CYPRESS_TEST_CALENDAR } from '../../data/Calendars';
import Pane, { PaneHeader } from '../interactors/pane';
import Button from '../interactors/button';
import MultiColumnList, { MultiColumnListCell } from '../interactors/multi-column-list';
import { checkCalendarFields, checkExpandButton, checkMenuAction } from '../support/fragments/calendar-info-pane';

describe('Checking the view of calendar on "Current Calendar assignments tab"', () => {
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
    cy.do(Pane('Calendar').find(Link('Current calendar assignments')).click());
  });

  after(() => {
    // delete test calendar
    cy.deleteServicePoint(CYPRESS_TEST_SERVICE_POINT.id);
    cy.deleteCalendar(testCalendarResponse.id);
  });

  it('should check that the "Current calendar assignments" tab contains all appropriate elements', () => {
    cy.do([
      PaneHeader('Current calendar assignments').find(Button('New')).exists(),
      MultiColumnList().find(MultiColumnListCell(CYPRESS_TEST_SERVICE_POINT.name, { column: 'Service point' })).exists(),
    ]);
  });

  it('should check that the fields of the calendar exists', () => {
    cy.do([
      Pane('Current calendar assignments').find(MultiColumnListCell(testCalendarResponse.name, { column: 'Calendar name' })).click(),
    ]);
    checkCalendarFields(CYPRESS_TEST_CALENDAR, CYPRESS_TEST_SERVICE_POINT);
  });

  it('should check that the expand/collapse button works correctly', () => {
    cy.do(
      Pane('Current calendar assignments').find(MultiColumnListCell(testCalendarResponse.name, { column: 'Calendar name' })).click(),
    );
    checkExpandButton();
  });

  it('should check that the individual calendar tab has the appropriate menu actions', () => {
    cy.do(
      Pane('Current calendar assignments').find(MultiColumnListCell(testCalendarResponse.name, { column: 'Calendar name' })).click(),
    );
    checkMenuAction(testCalendarResponse.name);
  });
});
