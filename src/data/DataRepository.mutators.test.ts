import * as Calendars from '../test/data/Calendars';
import * as Dates from '../test/data/Dates';
import { Calendar, DailyOpeningInfo } from '../types/types';
import DataRepository from './DataRepository';

test('Create calendar calls the appropriate mutator', async () => {
  const mutators = {
    create: jest.fn(() => Promise.resolve({
      ...Calendars.ALL_YEAR_SP_ONLINE_247,
      id: 'mocked'
    })),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn(),
  };

  const repository = new DataRepository([], [], mutators);
  expect(
    await repository.createCalendar(Calendars.ALL_YEAR_SP_ONLINE_247),
  ).toHaveProperty('id', 'mocked');

  expect(mutators.create).toHaveBeenCalledTimes(1);
  expect(mutators.create).toHaveBeenLastCalledWith(
    Calendars.ALL_YEAR_SP_ONLINE_247,
  );

  expect(
    await repository.createCalendar(Calendars.ALL_YEAR_SP_ONLINE_247),
  ).toHaveProperty('name', Calendars.ALL_YEAR_SP_ONLINE_247.name);

  expect(mutators.create).toHaveBeenCalledTimes(2);
  expect(mutators.create).toHaveBeenLastCalledWith(
    Calendars.ALL_YEAR_SP_ONLINE_247,
  );

  expect(mutators.update).not.toHaveBeenCalled();
  expect(mutators.delete).not.toHaveBeenCalled();
  expect(mutators.dates).not.toHaveBeenCalled();
});

test('Update calendar calls the appropriate mutator', async () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(() =>
      Promise.resolve({
        ...Calendars.ALL_YEAR_SP_ONLINE_247,
        id: 'mocked',
      }),
    ),
    delete: jest.fn(),
    dates: jest.fn(),
  };

  const repository = new DataRepository([], [], mutators);
  expect(
    await repository.updateCalendar(Calendars.ALL_YEAR_SP_ONLINE_247),
  ).toHaveProperty('id', 'mocked');

  expect(mutators.update).toHaveBeenCalledTimes(1);
  expect(mutators.update).toHaveBeenLastCalledWith(
    Calendars.ALL_YEAR_SP_ONLINE_247,
  );

  expect(
    await repository.updateCalendar(Calendars.ALL_YEAR_SP_ONLINE_247),
  ).toHaveProperty('name', Calendars.ALL_YEAR_SP_ONLINE_247.name);

  expect(mutators.update).toHaveBeenCalledTimes(2);
  expect(mutators.update).toHaveBeenLastCalledWith(
    Calendars.ALL_YEAR_SP_ONLINE_247,
  );

  expect(mutators.create).not.toHaveBeenCalled();
  expect(mutators.delete).not.toHaveBeenCalled();
  expect(mutators.dates).not.toHaveBeenCalled();
});

test('Delete calendar calls the appropriate mutator and encapsulates lists as needed', async () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn<Promise<void>, [Calendar[]]>(() => Promise.resolve()),
    dates: jest.fn(),
  };

  const repository = new DataRepository([], [], mutators);

  await repository.deleteCalendar(Calendars.ALL_YEAR_SP_ONLINE_247);
  expect(mutators.delete).toHaveBeenCalledTimes(1);
  expect(mutators.delete).toHaveBeenLastCalledWith([
    Calendars.ALL_YEAR_SP_ONLINE_247,
  ]);

  await repository.deleteCalendars([
    Calendars.ALL_YEAR_SP_ONLINE_247,
    Calendars.SPRING_SP_1_2,
  ]);
  expect(mutators.delete).toHaveBeenCalledTimes(2);
  expect(mutators.delete).toHaveBeenLastCalledWith([
    Calendars.ALL_YEAR_SP_ONLINE_247,
    Calendars.SPRING_SP_1_2,
  ]);
});

test('Daily opening information is requested appropriately', async () => {
  const mutators = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    dates: jest.fn<
      Promise<DailyOpeningInfo[]>,
      [{ servicePointId: string; startDate: string; endDate: string }]
    >(() => Promise.resolve([])),
  };

  const repository = new DataRepository([], [], mutators);

  expect(
    await repository.getDailyOpeningInfo(
      'test-id',
      Dates.MAR_1_DATE,
      Dates.OCT_1_DATE,
    ),
  ).toStrictEqual([]);
  expect(mutators.dates).toHaveBeenCalledTimes(1);
  expect(mutators.dates).toHaveBeenLastCalledWith({
    servicePointId: 'test-id',
    startDate: '2000-03-01',
    endDate: '2000-10-01',
  });
});
