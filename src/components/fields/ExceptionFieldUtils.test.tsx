import expectRender from '../../test/util/expectRender';
import { ExceptionFieldErrors } from './ExceptionFieldTypes';
import {
  // getDateField,
  // getDateTimeFields,
  getInnerRowError,
  getMainConflictError,
  getNameFieldError,
  isInnerRowConflicted,
  isOuterRowConflicted,
  outerRowSorter,
  updateInnerRowState,
  updateRowState
} from './ExceptionFieldUtils';

// describe('getDateField', () => { });
// describe('getDateTimeFields', () => { });

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

    it('undefined intraconflicts', () => {
      const response = isInnerRowConflicted(
        {
          interConflicts: new Set<number>()
        },
        0,
        0
      );
      expect(response).toBe(false);
    });

    it('empty intraconflicts', () => {
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

// describe('isOuterRowConflicted', () => {
//   it('finds errors when present', () => {
//     const av = {
//       interConflicts: new Set([1, 3, 5])
//     };

//     const response = isOuterRowConflicted(av, 3);
//     expect(response).toBe(true);
//   });

//   describe('does not find errors when data is missing', () => {
//     it('null error', () => {
//       const response = isInnerRowConflicted(null);
//       expect(response).toBe(false);
//     });

//     it('null interConflicts', () => {
//       const response = isInnerRowConflicted({});
//       expect(response).toBe(false);
//     });

//     it('empty interConflicts', () => {
//       const av = {
//         interConflicts: []
//       };

//       const response = isInnerRowConflicted(av);
//       expect(response).toBe(false);
//     });

//     it('interConflicts does not contain outerRowI', () => {
//       const av = {
//         interConflicts: new Set([1, 3, 5])
//       };

//       const response = isInnerRowConflicted(av, 2);
//       expect(response).toBe(false);
//     });
//   });
// });

// describe('outerRowSorter', () => {
//   const a = {
//     rows: [
//       { startDate: '2022-09-22' },
//       { startDate: '2022-09-24' },
//       { startDate: '2022-09-26' }
//     ]
//   };
//   const b = {
//     rows: [
//       { startDate: '2022-09-21' },
//       { startDate: '2022-09-23' },
//       { startDate: '2022-09-25' }
//     ]
//   };

//   it('av[0] is greater', () => {
//     const result = outerRowSorter(a, b);
//     expect(result).toEqual(1);
//   });

//   it('av[1] is greater', () => {
//     const result = outerRowSorter(b, a);
//     expect(result).toEqual(-1);
//   });
// });

// describe('updateInnerRowState', () => {
//   it('correctly updates given row', () => {
//     const r1 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };
//     const r2 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };
//     const r3 = { rows: [{ foo: 'bar' }, { bat: 'baz' }] };

//     const rowStates = [r1, r2, r3];

//     const newState = { monkey: 'bagel' };

//     const setRowStates = jest.fn();

//     updateInnerRowState(rowStates, setRowStates, 1, 1, newState);

//     r2.rows[1] = { ...r2.rows[1], ...newState };

//     expect(setRowStates).toHaveBeenCalledWith([r1, r2, r3]);
//   });
// });

// describe('updateRowState', () => {
//   it('correctly updates given row', () => {
//     const r1 = { foo: true, bar: false };
//     const r2 = { foo: true, bar: false };
//     const r3 = { foo: true, bar: false };
//     const newState = { bat: true };

//     const setRowStates = jest.fn();

//     updateRowState([r1, r2, r3], setRowStates, 1, newState);

//     expect(setRowStates).toHaveBeenCalledWith([r1, { ...r2, ...newState }, r3]);
//   });
// });
