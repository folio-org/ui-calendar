import { including, Link, not } from '@interactors/html';
import NavList from '@folio/stripes-testing/interactors/navlist';
import { CYPRESS_TEST_SERVICE_POINT } from '../../data/ServicePoints';
import { cypressTestCalendarInfo } from '../../data/e2e-data';
import Pane from '../interactors/pane';
import { CalendarCell } from '../interactors/calendar';
import Headline from '../interactors/headline';
import Button from '../interactors/button';


describe('Checking the view of calendar on "Monthly calendar view" tab', () => {
  let testCalendarResponse;

  before(() => {
    // login and open calendar settings
    cy.loginAsAdmin();

    // create test calendar
    cy.createServicePoint(CYPRESS_TEST_SERVICE_POINT, (response) => {
      console.log(response.body);
      cypressTestCalendarInfo.calendar.assignments = [response.body.id];

      cy.createCalendar(cypressTestCalendarInfo.calendar, (calResponse) => {
        testCalendarResponse = calResponse.body;
      });
    });
  });

  beforeEach(() => {
    cy.openCalendarSettings();
    cy.do([
      Pane('Calendar').find(Link('Monthly calendar view')).click(),
      Pane('Monthly calendar view').find(NavList()).navTo(CYPRESS_TEST_SERVICE_POINT.name)
    ]);
  });

  after(() => {
    // delete test calendar
    cy.deleteServicePoint(CYPRESS_TEST_SERVICE_POINT.id);
    cy.deleteCalendar(testCalendarResponse.id);
  });


  it('tests if the "previous" and "next" buttons of the calendar works as expected', () => {
    const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    cy.do([
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Headline(including(months[currentDate.getMonth()]))).exists(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Button({ ariaLabel: 'arrow-left' })).click(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Headline(including(months[(currentDate.getMonth() - 1) % 12]))).exists(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Button({ ariaLabel: 'arrow-right' })).click(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Headline(including(months[(currentDate.getMonth())]))).exists(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Button({ ariaLabel: 'arrow-right' })).click(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Headline(including(months[(currentDate.getMonth() + 1) % 12]))).exists(),
      Pane(CYPRESS_TEST_SERVICE_POINT.name).find(Button({ ariaLabel: 'arrow-left' })).click(),
    ]);
  });

  it('checks that the contents of the calendar cells are correct', () => {
    /**
     * Preconditions:
     *  cypressTestCalendarInfo.calendar is only open for all days in the current month
     */
    const days: string[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];


    const [startYear, startMonth, startDay] = cypressTestCalendarInfo.calendar.startDate.split('-');
    const startDateObj = new Date(parseInt(startYear, 10), parseInt(startMonth, 10) - 1, parseInt(startDay, 10));
    let dayOfWeekIndex = startDateObj.getUTCDay(); // to keep track of current day of the week
    let currDay = 1; // to keep track of dayLabel property of "CalendarCell"s

    let currDate = `${startYear}-${startMonth}-${('0' + startDay).slice(-2)}`; // to keep track of current date so exceptions can be verified
    const lastDay: number = parseInt(cypressTestCalendarInfo.calendar.endDate.split('-')[2], 10);

    // check adjacent days cells - every adjacent day cell's content must be equal to "Closed"
    cy.do(
      CalendarCell({ inCurrentMonth: false, content: not('Closed') }).absent()
    );


    while (currDay <= lastDay) {
      // if the current date is an exception...
      if (currDate in cypressTestCalendarInfo.expectedUIValues.monthlyCalendarView.exceptions) {
        const content = cypressTestCalendarInfo.expectedUIValues.monthlyCalendarView.exceptions[currDate];
        cy.do(CalendarCell({ dayLabel: currDay.toString(), content }).exists());
      } else {
        cy.do(CalendarCell({ dayLabel: currDay.toString(), content: cypressTestCalendarInfo.expectedUIValues.monthlyCalendarView.days[days[dayOfWeekIndex]] }).exists());
      }

      // update necessary variables
      currDay += 1;
      dayOfWeekIndex = (dayOfWeekIndex + 1) % 7;
      currDate = `${startYear}-${startMonth}-${('0' + currDay.toString()).slice(-2)}`;
    }
  });
});
