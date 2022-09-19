import DataRepository from './DataRepository';
import * as Calendars from '../test/data/Calendars';
import * as ServicePoints from '../test/data/ServicePoints';

test('Getters work as expected with undefined objects', () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn(),
    getUser: jest.fn()
  };

  const repository = new DataRepository(undefined, undefined, mutators);
  expect(repository.isLoaded()).toBe(false);
  expect(repository.areServicePointsLoaded()).toBe(false);
  expect(repository.getServicePoints()).toStrictEqual([]);
  expect(repository.areCalendarsLoaded()).toBe(false);
  expect(repository.getCalendars()).toStrictEqual([]);
});

test('Getters work as expected with empty objects', () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn(),
    getUser: jest.fn()
  };

  const repositoryEmptyCalendar = new DataRepository([], [], mutators);
  expect(repositoryEmptyCalendar.isLoaded()).toBe(true);
  expect(repositoryEmptyCalendar.areServicePointsLoaded()).toBe(true);
  expect(repositoryEmptyCalendar.areCalendarsLoaded()).toBe(true);
});

test('Getters work as expected (1 Calendar, 2 Service Points)', () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn(),
    getUser: jest.fn()
  };

  const repository1 = new DataRepository(
    [Calendars.SPRING_SP_1_2],
    [ServicePoints.SERVICE_POINT_1_DTO, ServicePoints.SERVICE_POINT_2_DTO],
    mutators
  );

  expect(repository1.isLoaded()).toBe(true);
  expect(repository1.areServicePointsLoaded()).toBe(true);
  expect(repository1.areCalendarsLoaded()).toBe(true);
  expect(repository1.getCalendars()).toStrictEqual([Calendars.SPRING_SP_1_2]);
  expect(repository1.getServicePoints()).toStrictEqual([
    ServicePoints.SERVICE_POINT_1,
    ServicePoints.SERVICE_POINT_2
  ]);

  expect(
    repository1.getServicePointsFromIds([
      '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      '3b071ddf-14ad-58a1-9fb5-b3737da888de'
    ])
  ).toStrictEqual([
    ServicePoints.SERVICE_POINT_1,
    ServicePoints.SERVICE_POINT_2
  ]);

  expect(
    repository1.getServicePointFromId('3a40852d-49fd-4df2-a1f9-6e2641a6e91f')
  ).toStrictEqual(ServicePoints.SERVICE_POINT_1);
  expect(
    repository1.getServicePointNamesFromIds([
      '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      '3b071ddf-14ad-58a1-9fb5-b3737da888de'
    ])
  ).toStrictEqual([
    ServicePoints.SERVICE_POINT_1.name,
    ServicePoints.SERVICE_POINT_2.name
  ]);

  expect(
    repository1.getCalendar('d3f3354c-2986-5d31-a84c-1ef3fd613ac6')
  ).toStrictEqual(Calendars.SPRING_SP_1_2);
});

test('Getters work as expected (multiple calendars)', () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn(),
    getUser: jest.fn()
  };

  const repository1 = new DataRepository(
    [Calendars.SPRING_SP_1_2, Calendars.SPRING_SP_3_4, Calendars.SUMMER_SP_3],
    [],
    mutators
  );

  expect(repository1.isLoaded()).toBe(true);
  expect(repository1.areServicePointsLoaded()).toBe(true);
  expect(repository1.areCalendarsLoaded()).toBe(true);
  expect(repository1.getCalendars()).toStrictEqual([
    Calendars.SPRING_SP_1_2,
    Calendars.SPRING_SP_3_4,
    Calendars.SUMMER_SP_3
  ]);
  expect(
    repository1.getCalendar('4047ecea-bb24-5f76-9403-d44144c57b66')
  ).toStrictEqual(Calendars.SUMMER_SP_3);
});
