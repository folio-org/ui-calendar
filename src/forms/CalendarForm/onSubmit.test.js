import { FORM_ERROR } from 'final-form';
import { FormattedMessage } from 'react-intl';
import { ErrorCode } from '../../types/types';
import getIntl from '../../test/util/getIntl';

import onSubmit from './onSubmit';

describe('onSubmit', () => {
  it('returns undefined given validation errors', () => {
    const form = {
      getState: () => ({
        hasValidationErrors: true,
      }),
    };

    onSubmit(null, null, null, null, form)
      .then(result => {
        expect(result).toBeUndefined();
      });
  });

  it('calls setIsSubmitting correctly', () => {
    const props = {
      closeParentLayer: jest.fn(),
      dataRepository: {},
      setIsSubmitting: jest.fn(),
      submitter: () => Promise.resolve({
        json: {},
      }),
    };

    const intl = getIntl('en-US', 'EST');
    const values = {
      'name': 'funky-chicken',
      'start-date': '2022-09-01',
      'end-date': '2022-09-30',
    };

    const form = {
      getState: () => ({
        hasValidationErrors: false,
      }),
    };

    onSubmit(props, null, intl, values, form)
      .then(() => {
        expect(props.setIsSubmitting).toHaveBeenNthCalledWith(1, true);
        expect(props.setIsSubmitting).toHaveBeenNthCalledWith(2, false);
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
      'name': 'funky-chicken',
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
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_DATE_OVERLAP,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith({ message, type: 'error' });
          expect(res['submission-errors']).not.toBeNull();
        });
    });

    it('handles ErrorCode.CALENDAR_NO_NAME', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_NO_NAME,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_DATE_RANGE', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_DATE_RANGE,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTIONS', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTIONS,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(res[FORM_ERROR]).toMatchObject(<>{message}</>);
        });
    });

    it('handles ErrorCode.INTERNAL_SERVER_ERROR', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.INTERNAL_SERVER_ERROR,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      const calloutProps = {
        message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
        type: 'error',
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(calloutProps);
          expect(res[FORM_ERROR]).toMatch(message);
        });
    });



    it('handles ErrorCode.INVALID_REQUEST', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.INVALID_REQUEST,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      const calloutProps = {
        message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
        type: 'error',
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(calloutProps);
          expect(res[FORM_ERROR]).toMatch(message);
        });
    });



    it('handles ErrorCode.INVALID_PARAMETER', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.INVALID_PARAMETER,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      const calloutProps = {
        message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
        type: 'error',
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(calloutProps);
          expect(res[FORM_ERROR]).toMatch(message);
        });
    });



    it('handles ErrorCode.CALENDAR_NOT_FOUND', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_NOT_FOUND,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      const calloutProps = {
        message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
        type: 'error',
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(calloutProps);
          expect(res[FORM_ERROR]).toMatch(message);
        });
    });

    it('handles ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY', () => {
      const props = {
        closeParentLayer: jest.fn(),
        dataRepository: {
          getServicePointNamesFromIds: (x) => x,
        },
        setIsSubmitting: jest.fn(),
        // eslint wants Promise.reject() to be called with "new Error()"
        // but that's not how our APIs work
        submitter: () => Promise.reject({ // eslint-disable-line prefer-promise-reject-errors
          response: {
            json: () => Promise.resolve({ errors: [
              {
                code: ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY,
                message,
                data: { conflictingServicePointIds }
              }
            ] }),
          }
        }),
      };

      const calloutProps = {
        message: <FormattedMessage id="ui-calendar.calendarForm.error.internalServerError" />,
        type: 'error',
      };

      onSubmit(props, calloutContext, intl, values, form)
        .then((res) => {
          expect(calloutContext.sendCallout).toHaveBeenCalledWith(calloutProps);
          expect(res[FORM_ERROR]).toMatch(message);
        });
    });
  });
});
