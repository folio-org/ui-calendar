import { including, Link } from '@interactors/html';
import TextField from '@folio/stripes-testing/interactors/text-field';
import Pane from '../interactors/pane';
import { MultiColumnListCell } from '../interactors/multi-column-list';
import Button from '../interactors/button';
import { cypressTestCalendarInfo } from '../../data/e2e-data';




describe('Duplicate an existing calendar to make a new one', () => {
  let testCalendarResponse;
  const duplicateCalendarName = 'test-calendar-a8531527-aa3b-447a-8c76-88f905ade409-duplicate';

  before(() => {
    // login
    cy.openCalendarSettings(false);

    // create test calendar
    cy.createCalendar(cypressTestCalendarInfo.calendar, (response) => {
      testCalendarResponse = response.body;
    });
  });

  after(() => {
    // delete test calendar
    cy.deleteCalendar(testCalendarResponse.id);
  });


  it('should allow user to duplicate an existing calendar', () => {
    cy.do([
      Pane('Calendar').find(Link('All calendars')).click(),
      Pane('All calendars').find(MultiColumnListCell(testCalendarResponse.name)).click(),
      Pane(testCalendarResponse.name).clickAction('Duplicate'),
      TextField(including('Calendar name')).fillIn(duplicateCalendarName),
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
        Pane('All calendars').find(MultiColumnListCell(duplicateCalendarName)).exists()
      ]);

      // delete duplicate calendar
      cy.deleteCalendar(duplicateCalendarID);
    });
  });
});
