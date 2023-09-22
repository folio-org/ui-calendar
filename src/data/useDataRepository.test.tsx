import { useOkapiKy } from '@folio/stripes/core';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import ky, { ResponsePromise } from 'ky';
import { KyInstance } from 'ky/distribution/types/ky';
import React, { createRef, MutableRefObject } from 'react';
import { Query, QueryClient, QueryClientProvider } from 'react-query';
import * as Calendars from '../test/data/Calendars';
import * as Dates from '../test/data/Dates';
import * as ServicePoints from '../test/data/ServicePoints';
import * as Users from '../test/data/Users';
import { dateToYYYYMMDD } from '../utils/DateUtils';
import DataRepository from './DataRepository';
import useDataRepository from './useDataRepository';

jest.mock('@folio/stripes/core');

const mockedUseOkapiKy = useOkapiKy as unknown as jest.Mock<typeof ky>;

function mockApi() {
  // mockImplementation will call these, to make testing easier
  // and more descriptive
  const getServicePointsMock = jest.fn(() => ({}));
  const getCalendarsMock = jest.fn(() => ({}));
  const getDatesMock = jest.fn<{ dates: never[] }, [string]>(() => ({
    dates: [] as never[]
  }));
  const getUsersMock = jest.fn();
  const postMock = jest.fn(() => ({
    json: () => Promise.resolve({})
  }));
  const putMock = jest.fn(() => ({
    json: () => Promise.resolve({})
  }));
  const deleteMock = jest.fn(() => Promise.resolve());

  mockedUseOkapiKy.mockImplementation(() => {
    const kyBase = jest.fn() as unknown as KyInstance;
    kyBase.get = (url) => {
      if ((url as string).startsWith('service-points')) {
        return {
          json: () => Promise.resolve(getServicePointsMock())
        } as unknown as ResponsePromise;
      } else if ((url as string).startsWith('calendar/calendars')) {
        return {
          json: () => Promise.resolve(getCalendarsMock())
        } as unknown as ResponsePromise;
      } else if ((url as string).startsWith('calendar/dates')) {
        return {
          json: () => Promise.resolve(getDatesMock(url as string))
        } as unknown as ResponsePromise;
      } else if ((url as string).startsWith('users')) {
        return {
          json: () => Promise.resolve(getUsersMock(url as string))
        } as unknown as ResponsePromise;
      } else {
        return fail(`ky attempted to GET an unknown URL ${url}`);
      }
    };
    kyBase.post = postMock as unknown as KyInstance['post'];
    kyBase.put = putMock as unknown as KyInstance['put'];
    kyBase.delete = deleteMock as unknown as KyInstance['delete'];
    return kyBase;
  });


  return {
    getServicePointsMock,
    getCalendarsMock,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock,
    renderHook: async () => {
      const result = renderHook(
        () => useDataRepository(),
        {
          wrapper: ({children}) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
        }
      );

      await waitFor(() => {
        expect(getServicePointsMock).toHaveBeenCalled();
        expect(getCalendarsMock).toHaveBeenCalled();
      });

      expect(getDatesMock).not.toHaveBeenCalled();
      expect(getUsersMock).not.toHaveBeenCalled();
      expect(postMock).not.toHaveBeenCalled();
      expect(putMock).not.toHaveBeenCalled();
      expect(deleteMock).not.toHaveBeenCalled();
      jest.clearAllMocks();

      return result;
    }
  };
}

test('useDataRepository queries work properly', async () => {
  const { getServicePointsMock, getCalendarsMock, renderHook } =
    mockApi();

  getServicePointsMock.mockReturnValue({
    servicepoints: [
      ServicePoints.SERVICE_POINT_1_DTO,
      ServicePoints.SERVICE_POINT_2_DTO,
      ServicePoints.SERVICE_POINT_3_DTO
    ]
  });
  getCalendarsMock.mockReturnValue({
    calendars: [
      Calendars.SPRING_SP_1_2,
      Calendars.SPRING_SP_3_4,
      Calendars.ALL_YEAR_SP_ONLINE_247
    ]
  });

  const { result: dataRepository } = await renderHook();

  await waitFor(() => expect(dataRepository.current?.areCalendarsLoaded()).toBe(true));
  expect(dataRepository.current?.getCalendars()).toStrictEqual([
    Calendars.SPRING_SP_1_2,
    Calendars.SPRING_SP_3_4,
    Calendars.ALL_YEAR_SP_ONLINE_247
  ]);
  expect(dataRepository.current?.getServicePoints()).toStrictEqual([
    ServicePoints.SERVICE_POINT_1,
    ServicePoints.SERVICE_POINT_2,
    ServicePoints.SERVICE_POINT_3
  ]);
});

test('useDataRepository create mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();

  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.createCalendar(Calendars.SUMMER_SP_1_2);
  });

  expect(postMock).toHaveBeenCalledWith('calendar/calendars', {
    json: Calendars.SUMMER_SP_1_2
  });

  // this queries should have been invalidated
  await waitFor(() => {
    expect(getCalendarsMock).toHaveBeenCalled();
  });
  // this query should NOT have been invalidated
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getDatesMock).not.toHaveBeenCalled();
  expect(getUsersMock).not.toHaveBeenCalled();
  expect(putMock).not.toHaveBeenCalled();
  expect(deleteMock).not.toHaveBeenCalled();
});

test('useDataRepository update mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();

  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.updateCalendar({
      ...Calendars.SUMMER_SP_1_2,
      name: 'New Name'
    });
  });

  expect(putMock).toHaveBeenCalledWith(
    `calendar/calendars/${Calendars.SUMMER_SP_1_2.id}`,
    {
      json: {
        ...Calendars.SUMMER_SP_1_2,
        name: 'New Name'
      }
    }
  );

  // this query should have been invalidated
  await waitFor(() => {
    expect(getCalendarsMock).toHaveBeenCalled();
  });
  // this query should NOT have been invalidated
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getDatesMock).not.toHaveBeenCalled();
  expect(getUsersMock).not.toHaveBeenCalled();
  expect(postMock).not.toHaveBeenCalled();
  expect(deleteMock).not.toHaveBeenCalled();
});

test('useDataRepository singular delete mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();


  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.deleteCalendar(Calendars.SUMMER_SP_1_2);
  });

  expect(deleteMock).toHaveBeenCalledWith(
    `calendar/calendars?id=${Calendars.SUMMER_SP_1_2.id}`
  );

  // this query should have been invalidated
  await waitFor(() => {
    expect(getCalendarsMock).toHaveBeenCalled();
  });
  // this query should NOT have been invalidated
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getDatesMock).not.toHaveBeenCalled();
  expect(getUsersMock).not.toHaveBeenCalled();
  expect(postMock).not.toHaveBeenCalled();
  expect(putMock).not.toHaveBeenCalled();
});

test('useDataRepository multiple delete mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();

  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.deleteCalendars([
      Calendars.SUMMER_SP_1_2,
      Calendars.SUMMER_SP_3
    ]);
  });

  expect(deleteMock).toHaveBeenCalledWith(
    `calendar/calendars?id=${Calendars.SUMMER_SP_1_2.id}&id=${Calendars.SUMMER_SP_3.id}`
  );

  // this query should have been invalidated
  await waitFor(() => {
    expect(getCalendarsMock).toHaveBeenCalled();
  });
  // this query should NOT have been invalidated
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getDatesMock).not.toHaveBeenCalled();
  expect(getUsersMock).not.toHaveBeenCalled();
  expect(postMock).not.toHaveBeenCalled();
  expect(putMock).not.toHaveBeenCalled();
});

test('useDataRepository get dates mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();

  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.getDailyOpeningInfo(
      ServicePoints.SERVICE_POINT_1.id,
      Dates.MAY_1_DATE,
      Dates.MAY_14_DATE
    );
  });

  expect(getDatesMock).toHaveBeenCalledWith(
    `calendar/dates/${
      ServicePoints.SERVICE_POINT_1.id
    }/all-openings?includeClosed=true&startDate=${dateToYYYYMMDD(
      Dates.MAY_1_DATE
    )}&endDate=${dateToYYYYMMDD(Dates.MAY_14_DATE)}&limit=2147483647`
  );

  // these queries should NOT have been invalidated
  expect(getCalendarsMock).not.toHaveBeenCalled();
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getUsersMock).not.toHaveBeenCalled();
  expect(postMock).not.toHaveBeenCalled();
  expect(putMock).not.toHaveBeenCalled();
  expect(deleteMock).not.toHaveBeenCalled();
});

test('useDataRepository get user mutation works properly', async () => {
  const {
    getServicePointsMock,
    getCalendarsMock,
    renderHook,
    getDatesMock,
    getUsersMock,
    postMock,
    putMock,
    deleteMock
  } = mockApi();

  const { result: dataRepository} = await renderHook();

  await act(async () => {
    await dataRepository.current?.getUser(Users.PETRO_PROKOPOVYCH.id);
  });

  expect(getUsersMock).toHaveBeenCalledWith(
    `users/${Users.PETRO_PROKOPOVYCH.id}`
  );

  // these queries should NOT have been invalidated
  expect(getCalendarsMock).not.toHaveBeenCalled();
  expect(getServicePointsMock).not.toHaveBeenCalled();
  expect(getDatesMock).not.toHaveBeenCalled();
  expect(postMock).not.toHaveBeenCalled();
  expect(putMock).not.toHaveBeenCalled();
  expect(deleteMock).not.toHaveBeenCalled();
});
