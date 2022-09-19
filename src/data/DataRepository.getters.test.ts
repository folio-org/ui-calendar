import DataRepository from './DataRepository';

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
