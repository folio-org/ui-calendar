import HTML from '@folio/stripes-testing/interactors/baseHTML';

export const CalendarCell = HTML.extend('Calendar component cell')
  .selector('[class^="calendarDay-"]')
  .filters({
    dayLabel: (el) => el.querySelector('[class^="dayLabel-"]').textContent,
    content: (el) => el.querySelector('div').textContent,
    inCurrentMonth: {
      apply: (el) => {
        return !el.getAttribute('class').match(/(^adjacentMonth-)|( adjacentMonth-)/);
      },
    }
  });
export default HTML.extend('Calendar component')
  .selector('[class^="calendar-"]')
  .locator(el => el.querySelector('[class^="headerRow-"] > [class^="headline-"]').textContent);
