import { fireEvent, render, screen } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import React from 'react';
import expectRender from '../../test/util/expectRender';
import withIntlConfiguration from '../../test/util/withIntlConfiguration';
import { ExceptionFieldErrors, ExceptionRowState } from './ExceptionFieldTypes';
import {
  getDateTimeFields,
  getInnerRowError,
  getMainConflictError,
  getNameFieldError,
  isInnerRowConflicted,
  isOuterRowConflicted,
  outerRowSorter,
  updateInnerRowState,
  updateRowState
} from './ExceptionFieldUtils';
import RowType from './RowType';

describe('getInnerRowError', () => {
  it('if not dirty, receives undefined', () => {
    const result = getInnerRowError(false, undefined, 0, 0, 'startDate');
    expect(result).toBeUndefined();
  });

  describe('empty conditions', () => {
    const error: ExceptionFieldErrors = {
      empty: {
        name: {},
        startDate: {
          0: { 0: 'a', 1: 'b', 2: 'c' },
          1: { 0: 'd', 1: 'e', 2: 'f' }
        },
        startTime: {},
        endDate: {},
        endTime: {}
      }
    };

    it('finds empty conditions ', () => {
      const result = getInnerRowError(true, error, 1, 1, 'startDate');
      expect(result).toBe('e');
    });

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'endDate');
      expect(result).toBeUndefined();
    });

    it('ignores missing outer row', () => {
      const result = getInnerRowError(true, error, 2, 1, 'startDate');
      expect(result).toBeUndefined();
    });

    it('ignores missing inner row', () => {
      const result = getInnerRowError(true, error, 1, 3, 'startDate');
      expect(result).toBeUndefined();
    });
  });

  describe('invalid conditions', () => {
    const error: ExceptionFieldErrors = {
      invalid: {
        startDate: {
          0: { 0: 'a', 1: 'b', 2: 'c' },
          1: { 0: 'd', 1: 'e', 2: 'f' }
        },
        startTime: {},
        endDate: {},
        endTime: {}
      }
    };

    it('finds empty conditions ', () => {
      const result = getInnerRowError(true, error, 1, 1, 'startDate');
      expect(result).toBe('e');
    });

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'endDate');
      expect(result).toBeUndefined();
    });

    it('ignores missing outer row', () => {
      const result = getInnerRowError(true, error, 2, 1, 'endDate');
      expect(result).toBeUndefined();
    });

    it('ignores missing inner row', () => {
      const result = getInnerRowError(true, error, 1, 3, 'endDate');
      expect(result).toBeUndefined();
    });
  });

  describe('receives undefined if no empty/invalid conditions', () => {
    const error: ExceptionFieldErrors = { interConflicts: new Set<number>() };

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'endDate');
      expect(result).toBeUndefined();
    });
  });

  describe('receives undefined if no error is present', () => {
    it('ignores missing fields', () => {
      const result = getInnerRowError(true, undefined, 1, 1, 'startDate');
      expect(result).toBeUndefined();
    });
  });
});

describe('getMainConflictError', () => {
  it('receives an error', () => {
    const error = {
      interConflicts: new Set(Array(42).keys())
    };
    const response = getMainConflictError(error);
    // it would be really nice to do something like
    //   expect(response).toBeInstanceOf(Headline)
    // but Headline is implemented via `forwardRef` and that seems to mess
    // with Jest's ability to do typechecking :(
    expect(response).not.toBeUndefined();
    expectRender(response).toContain(
      'Some exceptions have conflicts with each other'
    );
  });

  it('does not receive an error given undefined/missing', () => {
    expect(getMainConflictError(undefined)).toBeUndefined();
    expect(getMainConflictError({ intraConflicts: {} })).toBeUndefined();
  });

  it('does not receive an error given empty interConflicts', () => {
    const error = {
      interConflicts: new Set<number>()
    };
    const response = getMainConflictError(error);
    expect(response).toBeUndefined();
  });

  it('does not receive an error given missing interConflicts', () => {
    const response = getMainConflictError({
      intraConflicts: {}
    });
    expect(response).toBeUndefined();
  });
});

describe('getNameFieldError', () => {
  it('receives undefined if not touched', () => {
    const response = getNameFieldError(false, undefined, 0);
    expect(response).toBeUndefined();
  });

  it('receives undefined given empty input', () => {
    const response = getNameFieldError(true, undefined, 0);
    expect(response).toBeUndefined();
  });

  it('receives undefined given missing empty ', () => {
    const response = getNameFieldError(true, { intraConflicts: {} }, 0);
    expect(response).toBeUndefined();
  });

  it('receives undefined given missing name ', () => {
    const av = {
      empty: {
        name: {},

        startDate: {},
        startTime: {},
        endDate: {},
        endTime: {}
      }
    };
    const response = getNameFieldError(true, av, 0);
    expect(response).toBeUndefined();
  });

  const av: ExceptionFieldErrors = {
    empty: {
      name: { 0: 'a', 1: 'b', 2: 'c', 3: 'd' },
      startDate: {},
      startTime: {},
      endDate: {},
      endTime: {}
    }
  };

  it('receives undefined given missing index ', () => {
    const response = getNameFieldError(true, av, 4);
    expect(response).toBeUndefined();
  });

  it('receives error as expected', () => {
    const response = getNameFieldError(true, av, 2);
    expect(response).toBe('c');
  });
});

describe('isInnerRowConflicted', () => {
  it('finds errors when present', () => {
    const av = {
      intraConflicts: [new Set([0, 2, 4]), new Set([1, 3, 5])]
    };

    const response = isInnerRowConflicted(av, 1, 1);
    expect(response).toBe(true);
  });

  describe('does not find errors when data is missing', () => {
    it('undefined error', () => {
      const response = isInnerRowConflicted(undefined, 0, 0);
      expect(response).toBe(false);
    });

    it('undefined intra conflicts', () => {
      const response = isInnerRowConflicted(
        {
          interConflicts: new Set<number>()
        },
        0,
        0
      );
      expect(response).toBe(false);
    });

    it('empty intra conflicts', () => {
      const av = {
        intraConflicts: {}
      };

      const response = isInnerRowConflicted(av, 0, 0);
      expect(response).toBe(false);
    });

    const av = {
      intraConflicts: [new Set([0, 2, 4]), new Set([1, 3, 5])]
    };

    it('intraConflicts does not contain outerRowI', () => {
      const response = isInnerRowConflicted(av, 2, 0);
      expect(response).toBe(false);
    });

    it('intraConflicts does not contain innerRowI', () => {
      const response = isInnerRowConflicted(av, 1, 7);
      expect(response).toBe(false);
    });

    it('intraConflicts does contain innerRowI', () => {
      expect(isInnerRowConflicted(av, 0, 0)).toBe(true);
      expect(isInnerRowConflicted(av, 0, 2)).toBe(true);
      expect(isInnerRowConflicted(av, 1, 5)).toBe(true);
    });
  });
});

describe('isOuterRowConflicted and isInnerRowConflicted', () => {
  it('finds errors when present', () => {
    const av = {
      interConflicts: new Set([1, 3, 5])
    };

    expect(isOuterRowConflicted(av, 3)).toBe(true);
    expect(isOuterRowConflicted(av, 4)).toBe(false);
  });

  describe('does not find errors when data is missing', () => {
    it('outer undefined error', () => {
      const response = isOuterRowConflicted(undefined, 0);
      expect(response).toBe(false);
    });

    it('outer non-existent interConflicts', () => {
      const response = isOuterRowConflicted({ intraConflicts: {} }, 0);
      expect(response).toBe(false);
    });

    it('inner undefined error', () => {
      const response = isInnerRowConflicted(undefined, 0, 0);
      expect(response).toBe(false);
    });

    it('inner non-existent interConflicts', () => {
      const response = isInnerRowConflicted({ intraConflicts: {} }, 0, 0);
      expect(response).toBe(false);
    });

    it('empty intraConflicts', () => {
      const av = {
        intraConflicts: {}
      } as ExceptionFieldErrors;

      const response = isInnerRowConflicted(av, 0, 0);
      expect(response).toBe(false);
    });

    it('intraConflicts does not contain outerRowI', () => {
      const av = {
        intraConflicts: [new Set([1, 3, 5])]
      };

      const response = isInnerRowConflicted(av, 1, 0);
      expect(response).toBe(false);
    });

    it('intraConflicts does contain outerRowI and innerRowI', () => {
      const av = {
        intraConflicts: [new Set([1, 3, 5])]
      };

      const response = isInnerRowConflicted(av, 0, 1);
      expect(response).toBe(true);
    });

    it('interConflicts in non-zero outer contain outerRowI', () => {
      const av = {
        intraConflicts: [new Set([1, 3, 5]), new Set([2, 3, 5])]
      };

      const response = isInnerRowConflicted(av, 1, 2);
      expect(response).toBe(true);
    });
  });
});

describe('outerRowSorter', () => {
  const a = {
    rows: [
      { startDate: '2022-09-22' },
      { startDate: '2022-09-24' },
      { startDate: '2022-09-26' }
    ]
  } as ExceptionRowState;
  const b = {
    rows: [
      { startDate: '2022-09-21' },
      { startDate: '2022-09-23' },
      { startDate: '2022-09-25' }
    ]
  } as ExceptionRowState;

  it('av[0] is greater', () => {
    const result = outerRowSorter(a, b);
    expect(result).toEqual(1);
  });

  it('av[1] is greater', () => {
    const result = outerRowSorter(b, a);
    expect(result).toEqual(-1);
  });
});

describe('updateInnerRowState', () => {
  it('correctly updates given row', () => {
    const r1 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };
    const r2 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };
    const r3 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };

    const rowStates = [r1, r2, r3];

    const newState = { monkey: 'bagel' };

    const setRowStates = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateInnerRowState(rowStates as any, setRowStates, 1, 1, newState as any);

    r2.rows[1] = { ...r2.rows[1], ...newState };

    expect(setRowStates).toHaveBeenCalledWith([r1, r2, r3]);
  });
});

describe('updateRowState', () => {
  it('correctly updates given row', () => {
    const r1 = { foo: true, bar: false };
    const r2 = { foo: true, bar: false };
    const r3 = { foo: true, bar: false };
    const newState = { bat: true };

    const setRowStates = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateRowState([r1, r2, r3] as any, setRowStates, 1, newState as any);

    expect(setRowStates).toHaveBeenCalledWith([r1, { ...r2, ...newState }, r3]);
  });
});

describe('Date/time field generation', () => {
  it('Generates fields that interact properly', () => {
    const setRowStates = jest.fn();
    const onBlur = jest.fn();
    const fieldRefs = {
      startDate: { 0: {} },
      endDate: { 0: {} },
      startTime: { 0: {} },
      endTime: { 0: {} }
    };
    const rows = [
      {
        i: 0,
        name: 'Test',
        lastRowI: 0,
        type: RowType.Open,
        rows: [
          {
            i: 0,
            startDate: '',
            startTime: undefined,
            endDate: '',
            endTime: undefined
          }
        ]
      }
    ];

    const fields = getDateTimeFields({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props: { input: { onBlur }, fieldRefs } as any,
      row: rows[0],
      innerRow: rows[0].rows[0],
      realIndex: 0,
      innerRowRealIndex: 0,
      fieldRefs,
      isDirty: false,
      rowStates: rows,
      setRowStates
    });

    render(
      withIntlConfiguration(
        <>
          {fields.startDate}
          {fields.startTime}
          {fields.endDate}
          {fields.endTime}
        </>
      )
    );

    const [startDate, startTime, endDate, endTime] =
      screen.getAllByRole('textbox');

    fireEvent.change(startDate, { target: { value: 'foo' } });
    fireEvent.change(startTime, { target: { value: '02:24' } });
    fireEvent.change(startTime, { target: { value: '02:24 AM' } });
    fireEvent.change(endDate, { target: { value: 'foo' } });
    fireEvent.change(endTime, { target: { value: '02:24' } });
    fireEvent.change(endTime, { target: { value: '02:24 AM' } });

    // test focus
    userEvents.type(startDate, 'bar');
    userEvents.tab();
    fireEvent.blur(startDate);
    fireEvent.blur(startTime);
    fireEvent.blur(endDate);
    fireEvent.blur(endTime);

    expect(onBlur).toHaveBeenCalled();
    expect(setRowStates).toHaveBeenCalled();

    expect(fieldRefs).toHaveProperty('startDate.0.0', startDate);
    expect(fieldRefs).toHaveProperty('startTime.0.0', startTime);
    expect(fieldRefs).toHaveProperty('endDate.0.0', endDate);
    expect(fieldRefs).toHaveProperty('endTime.0.0', endTime);
  });
});
