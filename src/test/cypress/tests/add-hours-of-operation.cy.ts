import NavList from '@folio/stripes-testing/interactors/navlist';
import Accordion from '@folio/stripes-testing/interactors/accordion';
import { including, Link, matching, Select } from '@interactors/html';
import TextField from '@folio/stripes-testing/interactors/text-field';
import IconButton from '@folio/stripes-testing/interactors/icon-button';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import { cypressTestCalendarInfo } from '../../data/e2e-data';
import Button from '../interactors/button';
import Pane from '../interactors/pane';
import TimeDropdown from '../interactors/timedropdown';
import { MultiColumnListCell, MultiColumnListRow } from '../interactors/multi-column-list';

describe('Add new hours of operation for service point', () => {
  let testCalendarResponse;
  before(() => {
    // login and open calendar settings
    cy.openCalendarSettings(false);

    // create test calendar
    cy.createServicePoint(CYPRESS_TEST_SERVICE_POINT, (response) => {
      cypressTestCalendarInfo.calendar.assignments = [response.body.id];

      cy.createCalendar(cypressTestCalendarInfo.calendar, (calResponse) => {
        testCalendarResponse = calResponse.body;
      });
    });
  });


  after(() => {
    // delete test calendar
    cy.deleteServicePoint(CYPRESS_TEST_SERVICE_POINT.id);
    cy.deleteCalendar(testCalendarResponse.id);
  });


  it('adds new hours of operation for service point', () => {
    cy.do([
      Pane('Calendar').find(NavList()).navTo('Current calendar assignments'),
      Pane('Current calendar assignments').find(MultiColumnListCell(CYPRESS_TEST_SERVICE_POINT.name, { column: 'Service point' })).click(),
      Pane(cypressTestCalendarInfo.calendar.name).clickAction('Edit')
    ]);

    cy.url().should('match', /\/settings\/calendar\/active\/edit\/.+$/g);

    cy.do([
      Accordion('Hours of operation').find(Button('Add row')).click(),
      MultiColumnListRow({ index: 7 }).find(MultiColumnListCell({ column: 'Status' })).find(Select()).choose(cypressTestCalendarInfo.addHoursOfOperation.data.status),
      MultiColumnListRow({ index: 7 }).find(MultiColumnListCell({ column: 'Start day' })).find(Select()).choose(cypressTestCalendarInfo.addHoursOfOperation.data.startDay),
      MultiColumnListRow({ index: 7 }).find(MultiColumnListCell({ column: 'End day' })).find(Select()).choose(cypressTestCalendarInfo.addHoursOfOperation.data.endDay),
    ]);

    // if status is open, set start time and end time
    if (cypressTestCalendarInfo.addHoursOfOperation.data.status === 'Open') {
      cy.do([
        MultiColumnListRow({ index: 7 }).find(MultiColumnListCell({ column: 'Start time' }))
          .find(TextField())
          .find(IconButton({ id: matching(/^timepicker-toggle-button-/) }))
          .click(),
        TimeDropdown().exists(),
        TimeDropdown().setTimeAndClose(cypressTestCalendarInfo.addHoursOfOperation.data.startTime),
        MultiColumnListRow({ index: 7 }).find(MultiColumnListCell({ column: 'End time' }))
          .find(TextField())
          .find(IconButton({ id: matching(/^timepicker-toggle-button-/) }))
          .click(),
        TimeDropdown().exists(),
        TimeDropdown().setTimeAndClose(cypressTestCalendarInfo.addHoursOfOperation.data.endTime),
      ]);
    }

    cy.do(
      Button('Save and close').click()
    );

    // intercept http request
    cy.intercept('PUT', Cypress.env('calendar_api_url') + '/' + testCalendarResponse.id, (req) => {
      req.continue((res) => {
        expect(res.statusCode).equals(200);
      });
    }).as('updateCalendar');

    // check that new calendar exists in list of calendars
    cy.wait('@updateCalendar').then(() => {
      cy.openCalendarSettings();
      cy.do([
        Pane('Calendar').find(Link('All calendars')).click(),
        Pane('All calendars').find(MultiColumnListCell(cypressTestCalendarInfo.calendar.name)).click()
      ]);

      const jobs = [];

      Object.keys(cypressTestCalendarInfo.addHoursOfOperation.expectedUIValues).forEach(day => {
        const row = Pane(cypressTestCalendarInfo.calendar.name)
          .find(Accordion('Hours of operation'))
          .find(MultiColumnListRow({ content: including(day), isContainer: true }));
        jobs.push(
          row.find(MultiColumnListCell({
            column: 'Open',
            content: including(cypressTestCalendarInfo.addHoursOfOperation.expectedUIValues[day].startTime)
          }))
            .exists(),
          row.find(MultiColumnListCell({
            column: 'Close',
            content: including(cypressTestCalendarInfo.addHoursOfOperation.expectedUIValues[day].endTime)
          }))
            .exists()
        );
      });

      cy.do(jobs);
    });
  });
});
