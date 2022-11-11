import { including, Link } from '@interactors/html';
import TextField from '@folio/stripes-testing/interactors/text-field';
import HTML from '@folio/stripes-testing/interactors/baseHTML';
import { Calendar } from '@folio/stripes-testing/interactors/datepicker';
import Accordion from '@folio/stripes-testing/interactors/accordion';
import MultiSelect from '../interactors/multi-select';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import { CYPRESS_TEST_CALENDAR } from '../../data/Calendars';
import Pane, { PaneHeader } from '../interactors/pane';
import { MultiColumnList, MultiColumnListCell, MultiColumnListRow } from '../interactors/multi-column-list';
import Button from '../interactors/button';


const toggleCalendarButton = HTML.extend('toggle calendar button').selector('button[id^=datepicker-toggle-calendar-button-dp-]');

describe('Add new calendar for service point', () => {
  let testCalendarResponse;

  const newCalendarInfo = {
    name: 'test-calendar-create',
    startDay: 1,
    endDay: 2
  };
  before(() => {
    // login and open calendar settings
    cy.loginAsAdmin();

    // create test service point
    cy.createServicePoint(CYPRESS_TEST_SERVICE_POINT, (response) => {
      CYPRESS_TEST_CALENDAR.assignments = [response.body.id];

      cy.createCalendar(CYPRESS_TEST_CALENDAR, (calResponse) => {
        testCalendarResponse = calResponse.body;
      });
    });
    cy.openCalendarSettings();
  });


  after(() => {
    // delete test service point and calendar
    cy.deleteServicePoint(CYPRESS_TEST_SERVICE_POINT.id);
  });

  it('adds new calendar', () => {
    cy.do([
      Pane('Calendar').find(Link('Current calendar assignments')).click(),
      Pane('Current calendar assignments').find(MultiColumnListCell(CYPRESS_TEST_SERVICE_POINT.name, { column: 'Service point' })).click(),
      Pane(testCalendarResponse.name).find(Button({ ariaLabel: 'Close ' + testCalendarResponse.name })).click(),
      PaneHeader('Current calendar assignments').find(Button('New')).click()
    ]);

    cy.deleteCalendar(testCalendarResponse.id);

    cy.url().should('include', '/settings/calendar/active/create');



    cy.do([
      TextField(including('Calendar name')).fillIn(newCalendarInfo.name),
      TextField(including('Start date')).find(toggleCalendarButton()).click(),
      Calendar().clickActiveDay(newCalendarInfo.startDay),
      TextField(including('End date')).find(toggleCalendarButton()).click(),
      Calendar().clickActiveDay(newCalendarInfo.endDay),
      MultiSelect({ label: 'Service points' }).choose(CYPRESS_TEST_SERVICE_POINT.name),
      Accordion('Hours of operation').find(MultiColumnList()).find(MultiColumnListRow({ index: 0 })).find(MultiColumnListCell({ column: 'Actions' }))
        .find(Button({ ariaLabel: 'trash' }))
        .click(),
      Button('Save and close').click()
    ]);



    // intercept http request
    let duplicateCalendarID;
    cy.intercept('POST', Cypress.env('calendar_api_url'), (req) => {
      req.continue((res) => {
        expect(res.statusCode).equals(201);
        duplicateCalendarID = res.body.id;
      });
    }).as('createDuplicateCalendar');

    // check that duplicate calendar exists in list of calendars
    cy.wait('@createDuplicateCalendar').then(() => {
      cy.openCalendarSettings();
      cy.do([
        Pane('Calendar').find(Link('All calendars')).click(),
        Pane('All calendars').find(MultiColumnListCell(newCalendarInfo.name)).exists(),
      ]);

      // delete duplicate calendar
      cy.deleteCalendar(duplicateCalendarID);
    });
  });
});
