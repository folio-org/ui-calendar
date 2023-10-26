import { useOkapiKy } from '@folio/stripes/core';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  useMemo
} from 'react';
import { Calendar, CalendarDTO, User } from '../types/types';
import DataRepository from './DataRepository';
import {
  CalendarResponseDTO,
  DateResponseDTO,
  ServicePointDTO,
  ServicePointResponseDTO
} from './types';

export const MAX_LIMIT = 2147483647;

/**
 * Hook to include a data repository in the given component
 */
export default function useDataRepository(): DataRepository {
  const ky = useOkapiKy();

  const servicePoints = useQuery<ServicePointDTO[]>(
    ['ui-calendar', 'service-points'],
    async () => {
      const data = await ky
        .get(`service-points?cql.allRecords=1&limit=${MAX_LIMIT}`)
        .json<ServicePointResponseDTO>();
      return data.servicepoints;
    }
  );

  const calendars = useQuery<CalendarDTO[]>(
    ['ui-calendar', 'calendars'],
    async () => {
      const data = await ky
        .get(`calendar/calendars?limit=${MAX_LIMIT}`)
        .json<CalendarResponseDTO>();
      return data.calendars;
    }
  );

  const queryClient = useQueryClient();

  const mutationInvalidator = {
    onSuccess: () => {
      queryClient.invalidateQueries(['ui-calendar', 'calendars']);
    }
  };

  const createCalendar = useMutation(async (calendar: Calendar) => {
    return ky
      .post('calendar/calendars', {
        json: calendar
      })
      .json<CalendarDTO>();
  }, mutationInvalidator);

  const putCalendar = useMutation(async (calendar: Calendar) => {
    return ky
      .put(`calendar/calendars/${calendar.id}`, {
        json: calendar
      })
      .json<CalendarDTO>();
  }, mutationInvalidator);

  const deleteCalendars = useMutation(async (calendarsToDelete: Calendar[]) => {
    const queryString = calendarsToDelete.map((c) => `id=${c.id}`).join('&');
    await ky.delete(`calendar/calendars?${queryString}`);
  }, mutationInvalidator);

  const getDateRange = useMutation(
    async ({
      servicePointId,
      startDate,
      endDate
    }: {
      servicePointId: string;
      startDate: string;
      endDate: string;
    }) => {
      const data = await ky
        .get(
          `calendar/dates/${servicePointId}/all-openings?includeClosed=true&startDate=${startDate}&endDate=${endDate}&limit=${MAX_LIMIT}`
        )
        .json<DateResponseDTO>();
      return data.dates;
    }
  );

  const getUserInfo = useMutation(
    ({ userId, signal }: { userId: string; signal?: AbortSignal }) => {
      return ky.get(`users/${userId}`, { signal }).json<User>();
    }
  );

  return useMemo(() => new DataRepository(
    calendars.isSuccess ? calendars.data : undefined,
    servicePoints.isSuccess ? servicePoints.data : undefined,
    {
      create: createCalendar.mutateAsync,
      update: putCalendar.mutateAsync,
      delete: deleteCalendars.mutateAsync,
      dates: getDateRange.mutateAsync,
      getUser: getUserInfo.mutateAsync
    }
  ), [calendars.isSuccess, calendars.data, servicePoints.isSuccess, servicePoints.data, createCalendar.mutateAsync, putCalendar.mutateAsync, deleteCalendars.mutateAsync, getDateRange.mutateAsync, getUserInfo.mutateAsync]);
}
