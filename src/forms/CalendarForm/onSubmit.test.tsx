import { FORM_ERROR } from 'final-form';
import { HTTPError } from 'ky';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import DataRepository from '../../data/DataRepository';
import * as Calendars from '../../test/data/Calendars';
import {
  ONLINE_DTO,
  SERVICE_POINT_1_DTO,
  SERVICE_POINT_2_DTO,
  SERVICE_POINT_3_DTO,
  SERVICE_POINT_4_DTO,
} from '../../test/data/ServicePoints';
import * as Weekdays from '../../test/data/Weekdays';
import getIntl from '../../test/util/getIntl';
import { ErrorCode } from '../../types/types';
import { LocaleWeekdayInfo } from '../../utils/WeekdayUtils';
import calendarToInitialValues from '../calendarToInitialValues';
import onSubmit from './onSubmit';

const localeWeekdaysSunday: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Monday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Tuesday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Wednesday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Thursday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Friday, short: 'XXXXX', long: 'XXXXXXXX' },
  { weekday: Weekdays.Saturday, short: 'XXXXX', long: 'XXXXXXXX' },
];

function throwHTTPError(response: Record<string, unknown>): HTTPError {
  throw new HTTPError(
    { json: () => Promise.resolve(response) } as any,
    {} as any,
    {} as any
  );
}

describe('onSubmit', () => {
  it('returns undefined given validation errors', () => {
    const form = {
      getState: () => ({
        hasValidationErrors: true,
      }),
    };

    onSubmit(
      null as any,
      null as any,
      null as any,
      null as any,
      form as any
    ).then((result) => {
      expect(result).toBeUndefined();
    });
  });

  it('calls setIsSubmitting correctly', () => {
    [
      Calendars.ALL_YEAR_SP_ONLINE_247,
      Calendars.SPRING_SP_1_2,
      Calendars.SPRING_SP_3_4,
      Calendars.SPRING_UNASSIGNED,
      Calendars.SUMMER_SP_1_2,
      Calendars.SUMMER_SP_3,
      Calendars.SUMMER_SP_4_245,
    ].forEach((cal) => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {},
        setIsSubmitting: jest.fn(),
        submitter: () => Promise.resolve({
          json: {},
        }),
      };

      const intl = getIntl('en-US', 'EST');
      const values = calendarToInitialValues(
        new DataRepository(
          [],
          [
            SERVICE_POINT_1_DTO,
            SERVICE_POINT_2_DTO,
            SERVICE_POINT_3_DTO,
            SERVICE_POINT_4_DTO,
            ONLINE_DTO,
          ],
          {} as any
        ),
        localeWeekdaysSunday,
        cal
      );

      const form = {
        getState: () => ({
          hasValidationErrors: false,
        }),
      };

      onSubmit(
        props as any,
        null as any,
        intl,
        values as any,
        form as any
      ).then(() => {
        expect(props.setIsSubmitting).toHaveBeenNthCalledWith(1, true);
        expect(props.setIsSubmitting).toHaveBeenNthCalledWith(2, false);
      });
    });
  });

  describe('handles errors', () => {
    const conflictingServicePointIds = ['a', 'b'];
    const message = 'message';
    const calloutContext = {
      sendCallout: jest.fn(),
    };

    const intl = getIntl('en-US', 'EST');
    const values = {
      name: 'funky-chicken',
      'start-date': '2022-09-01',
      'end-date': '2022-09-30',
    };

    const form = {
      getState: () => ({
        hasValidationErrors: false,
      }),
    };

    it('handles ErrorCode.CALENDAR_DATE_OVERLAP', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x: any) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => {
          throwHTTPError({
            errors: [
              {
                code: ErrorCode.CALENDAR_DATE_OVERLAP,
                message,
                data: { conflictingServicePointIds },
              },
            ],
          });
        },
      };

      onSubmit(props as any, calloutContext, intl, values, form as any).then(
        (res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith({
            message,
            type: 'error',
          });
          expect(res?.['submission-errors']).not.toBeNull();
        }
      );
    });

    [
      ErrorCode.CALENDAR_NO_NAME,
      ErrorCode.CALENDAR_INVALID_DATE_RANGE,
      ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS,
      ErrorCode.CALENDAR_INVALID_EXCEPTIONS,
      ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER,
      ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY,
      ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME,
      ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS,
    ].forEach((code) => it(`handles ${code}`, () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x: any) => x,
        },
        setIsSubmitting: jest.fn(),
        submitter: () => {
          throwHTTPError({
            errors: [
              {
                code,
                message,
              },
            ],
          });
        },
      };

      onSubmit(props as any, calloutContext, intl, values, form as any).then(
        (res) => {
          expect(res?.[FORM_ERROR]).toMatchObject(<>{message}</>);
        }
      );
    }));
    [
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorCode.INVALID_REQUEST,
      ErrorCode.INVALID_PARAMETER,
      ErrorCode.CALENDAR_NOT_FOUND,
      ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY,
    ].forEach((code) => it(`handles ${code}`, () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x: any) => x,
        },
        setIsSubmitting: jest.fn(),
        submitter: () => {
          throwHTTPError({
            errors: [
              {
                code,
                message,
              },
            ],
          });
        },
      };

      const calloutProps = {
        message: (
          <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />
        ),
        type: 'error',
      };

      onSubmit(props as any, calloutContext, intl, values, form as any).then(
        (res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(
            calloutProps
          );
          expect(res?.[FORM_ERROR]).toMatch(message);
        }
      );
    }));
  });
});
