import { including, Link } from '@interactors/html';
import Accordion from '@folio/stripes-testing/interactors/accordion';
import List, { ListItem } from '@folio/stripes-testing/interactors/list';
import KeyValue from '@folio/stripes-testing/interactors/key-value';
import { CYPRESS_TEST_CALENDAR } from '../../data/Calendars';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import Pane from '../interactors/pane';
import { MultiColumnListCell } from '../interactors/multi-column-list';
import Headline from '../interactors/headline';
import Button from '../interactors/button';


describe('Checking the view of calendar on "All Calendars" tab', () => {
  let testCalendarResponse;

  before(() => {
    // login and open calendar settings
    cy.loginAsAdmin();

    // create test calendar
    cy.createServicePoint(CYPRESS_TEST_SERVICE_POINT, (response) => {
      console.log('response: ', response);
      CYPRESS_TEST_CALENDAR.assignments = [response.body.id];

      cy.createCalendar(CYPRESS_TEST_CALENDAR, (calResponse) => {
        testCalendarResponse = calResponse.body;
        console.log('testCalendarResponse', testCalendarResponse);
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
    const firstClosureException = CYPRESS_TEST_CALENDAR.exceptions.find(cal => cal.openings.length === 0);
    const firstOpeningException = CYPRESS_TEST_CALENDAR.exceptions.find(cal => cal.openings.length !== 0);
    cy.do([
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name)).click(),
      Headline(CYPRESS_TEST_CALENDAR.name).exists(),
      KeyValue('Start date').exists(),
      KeyValue('End date').exists(),
      Accordion('Service point assignments').exists(),
      Accordion('Service point assignments').find(List()).find(ListItem(including(CYPRESS_TEST_SERVICE_POINT.name))).exists(),
      Accordion('Hours of operation').exists(),
      Accordion('Exceptions — openings').exists(),
      Accordion('Exceptions — openings').find(MultiColumnListCell(firstOpeningException.name)).exists(),
      Accordion('Exceptions — closures').exists(),
      Accordion('Exceptions — closures').find(MultiColumnListCell(firstClosureException.name)).exists(),
      Accordion('Record metadata').exists(),
    ]);
  });

  it('should check that the expand/collapse button works correctly', () => {
    cy.do([
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name)).click(),
      Button('Expand all').absent(),
      Button('Collapse all').exists(),


      Accordion('Service point assignments', { open: true }).exists(),
      Accordion('Hours of operation', { open: true }).exists(),
      Accordion('Exceptions — openings', { open: true }).exists(),
      Accordion('Exceptions — closures', { open: true }).exists(),
      Accordion('Record metadata', { open: true }).exists(),

      Button('Collapse all').click(),
      Button('Collapse all').absent(),
      Button('Expand all').exists(),

      Accordion('Service point assignments', { open: false }).exists(),
      Accordion('Hours of operation', { open: false }).exists(),
      Accordion('Exceptions — openings', { open: false }).exists(),
      Accordion('Exceptions — closures', { open: false }).exists(),
      Accordion('Record metadata', { open: false }).exists()
    ]);
  });

  it('should check that the individual calendar tab has the appropriate menu actions', () => {
    cy.do([
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name)).click(),
      Pane(testCalendarResponse.name).find(Button({ className: including('actionMenuToggle') })).click(),
      Button('Edit').exists(),
      Button('Duplicate').exists(),
      Button('Delete').exists()
    ]);
  });
});
