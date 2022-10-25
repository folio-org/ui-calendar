
import { getCalendarsToPurge, AgeCriteria, AssignmentCriteria } from './PurgeModal';
import DataRepository from '../data/DataRepository';
import * as Calendars from '../test/data/Calendars';

const mutators = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  dates: jest.fn(),
  getUser: jest.fn()
};

test('getCalendarsToPurge works with no criteria and empty calendar', () => {
  const repository = new DataRepository(
    [],
    [],
    mutators
  );
  expect(getCalendarsToPurge(repository.getCalendars())).toStrictEqual([]);
});

test('getCalendarsToPurge works with one or more criteria missing and a non-empty calendar', () => {
  const repository = new DataRepository(
    [Calendars.SPRING_SP_1_2, Calendars.SPRING_SP_3_4, Calendars.SUMMER_SP_3],
    [],
    mutators
  );
  expect(getCalendarsToPurge(repository.getCalendars())).toStrictEqual([]);
  expect(getCalendarsToPurge(repository.getCalendars(), AgeCriteria.MONTHS_3)).toStrictEqual([]);
  expect(getCalendarsToPurge(repository.getCalendars(), undefined, AssignmentCriteria.ANY)).toStrictEqual([]);
});

test('getCalendarsToPurge works with assignmentCriteria set to NONE', () => {
  const repository = new DataRepository(
    [Calendars.SPRING_SP_1_2, Calendars.SPRING_SP_3_4, Calendars.SUMMER_SP_3],
    [],
    mutators
  );
  expect(getCalendarsToPurge(repository.getCalendars(), AgeCriteria.MONTHS_3, AssignmentCriteria.NONE)).toStrictEqual([]);
});


test('getCalendarsToPurge works with assignmentCriteria and AgeCriteria', () => {
  const repository = new DataRepository(
    [Calendars.SPRING_SP_1_2, Calendars.SPRING_SP_3_4, Calendars.SUMMER_SP_3],
    [],
    mutators
  );
  expect(getCalendarsToPurge(repository.getCalendars(), AgeCriteria.YEARS_2, AssignmentCriteria.ANY)).toStrictEqual([Calendars.SPRING_SP_1_2, Calendars.SPRING_SP_3_4, Calendars.SUMMER_SP_3]);
});
