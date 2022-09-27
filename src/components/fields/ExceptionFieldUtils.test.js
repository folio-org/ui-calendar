import {
  // getDateField,
  // getDateTimeFields,
  getInnerRowError,
  getMainConflictError,
  getNameFieldError,
  isInnerRowConflicted,
  isOuterRowConflicted,
  outerRowSorter,
  // updateInnerRowState,
  updateRowState,
} from './ExceptionFieldUtils';

// describe('getDateField', () => { });
// describe('getDateTimeFields', () => { });

describe('getInnerRowError', () => {
  it('if not dirty, receives undefined', () => {
    const result = getInnerRowError(false);
    expect(result).toBeUndefined();
  });

  describe('empty conditions', () => {
    const error = {
      empty: {
        startDate: [
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
        ]
      }
    };

    it('finds empty conditions ', () => {
      const result = getInnerRowError(true, error, 1, 1, 'startDate');
      expect(result).toBe('e');
    });

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'missing field');
      expect(result).toBeUndefined();
    });

    it('ignores missing outer row', () => {
      const result = getInnerRowError(true, error, 2, 1, 'missing field');
      expect(result).toBeUndefined();
    });

    it('ignores missing inner row', () => {
      const result = getInnerRowError(true, error, 1, 3, 'missing field');
      expect(result).toBeUndefined();
    });
  });

  describe('invalid conditions', () => {
    const error = {
      invalid: {
        startDate: [
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
        ]
      }
    };

    it('finds empty conditions ', () => {
      const result = getInnerRowError(true, error, 1, 1, 'startDate');
      expect(result).toBe('e');
    });

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'missing field');
      expect(result).toBeUndefined();
    });

    it('ignores missing outer row', () => {
      const result = getInnerRowError(true, error, 2, 1, 'missing field');
      expect(result).toBeUndefined();
    });

    it('ignores missing inner row', () => {
      const result = getInnerRowError(true, error, 1, 3, 'missing field');
      expect(result).toBeUndefined();
    });
  });

  describe('receives undefined if no empty/invalid conditions', () => {
    const error = {};

    it('ignores missing fields', () => {
      const result = getInnerRowError(true, error, 1, 1, 'missing field');
      expect(result).toBeUndefined();
    });
  });

  describe('receives undefined if no error is present', () => {
    it('ignores missing fields', () => {
      const result = getInnerRowError(true, null, 1, 1, 'missing field');
      expect(result).toBeUndefined();
    });
  });
});

describe('getMainConflictError', () => {
  it('receives an error', () => {
    const error = {
      interConflicts: {
        size: 42
      }
    };
    const response = getMainConflictError(error);
    // it would be really nice to do something like
    //   expect(response).toBeInstanceOf(Headline)
    // but Headline is implemented via `forwardRef` and that seems to mess
    // with Jest's ability to do typechecking :(
    expect(response).not.toBeUndefined();
  });

  it('does not receive an error given null', () => {
    const response = getMainConflictError();
    expect(response).toBeUndefined();
  });

  it('does not receive an error given empty interConflicts', () => {
    const error = {
      interConflicts: []
    };
    const response = getMainConflictError(error);
    expect(response).toBeUndefined();
  });

  it('does not receive an error given missing interConflicts', () => {
    const response = getMainConflictError({});
    expect(response).toBeUndefined();
  });
});

describe('getNameFieldError', () => {
  it('receives undefined if not touched', () => {
    const response = getNameFieldError(false);
    expect(response).toBeUndefined();
  });

  it('receives undefined given empty input', () => {
    const response = getNameFieldError(true, null);
    expect(response).toBeUndefined();
  });

  it('receives undefined given missing empty ', () => {
    const response = getNameFieldError(true, {});
    expect(response).toBeUndefined();
  });

  it('receives undefined given missing name ', () => {
    const av = {
      empty: {},
    };
    const response = getNameFieldError(true, av);
    expect(response).toBeUndefined();
  });

  it('receives undefined given missing index ', () => {
    const av = {
      empty: {
        name: [0, 1, 2, 3]
      },
    };
    const response = getNameFieldError(true, av, 4);
    expect(response).toBeUndefined();
  });

  it('receives error as expected', () => {
    const av = {
      empty: {
        name: [0, 1, 2, 3]
      },
    };
    const response = getNameFieldError(true, av, 2);
    expect(response).toBe(2);
  });
});

describe('isInnerRowConflicted', () => {
  it('finds errors when present', () => {
    const av = {
      intraConflicts: [
        new Set([0, 2, 4]),
        new Set([1, 3, 5]),
      ]
    };

    const response = isInnerRowConflicted(av, 1, 1);
    expect(response).toBe(true);
  });

  describe('does not find errors when data is missing', () => {
    it('null error', () => {
      const response = isInnerRowConflicted(null);
      expect(response).toBe(false);
    });

    it('null intraconflicts', () => {
      const response = isInnerRowConflicted({});
      expect(response).toBe(false);
    });

    it('empty intraconflicts', () => {
      const av = {
        intraConflicts: []
      };

      const response = isInnerRowConflicted(av);
      expect(response).toBe(false);
    });

    it('intraConflicts does not contain outerRowI', () => {
      const av = {
        intraConflicts: [
          new Set([0, 2, 4]),
          new Set([1, 3, 5]),
        ]
      };

      const response = isInnerRowConflicted(av, 2);
      expect(response).toBe(false);
    });

    it('intracConflicts does not contain innerRowI', () => {
      const av = {
        intraConflicts: [
          new Set([0, 2, 4]),
          new Set([1, 3, 5]),
        ]
      };

      const response = isInnerRowConflicted(av, 1, 7);
      expect(response).toBe(false);
    });
  });
});

// export type ExceptionFieldErrors = RequireExactlyOne<{
//   empty?: {
//     name: Record<number, ReactNode>;
//   } & {
//     [field in keyof Omit<ExceptionRowState['rows'][0], 'i'>]: Record<
//       number,
//       Record<number, ReactNode>
//     >;
//   };
//   invalid?: {
//     [field in keyof Omit<ExceptionRowState['rows'][0], 'i'>]: Record<
//       number,
//       Record<number, ReactNode>
//     >;
//   };
//   interConflicts?: Set<number>;
//   intraConflicts?: Record<number, Set<number>>;
// }>;

// describe('isOuterRowConflicted', () => { });

// export function isOuterRowConflicted(
//   error: ExceptionFieldErrors | undefined,
//   outerRowI: number
// ): boolean {
//   return !!error?.interConflicts?.has(outerRowI);
// }
describe('isOuterRowConflicted', () => {
  it('finds errors when present', () => {
    const av = {
      interConflicts: new Set([1, 3, 5]),
    };

    const response = isOuterRowConflicted(av, 3);
    expect(response).toBe(true);
  });

  describe('does not find errors when data is missing', () => {
    it('null error', () => {
      const response = isInnerRowConflicted(null);
      expect(response).toBe(false);
    });

    it('null interConflicts', () => {
      const response = isInnerRowConflicted({});
      expect(response).toBe(false);
    });

    it('empty interConflicts', () => {
      const av = {
        interConflicts: []
      };

      const response = isInnerRowConflicted(av);
      expect(response).toBe(false);
    });

    it('interConflicts does not contain outerRowI', () => {
      const av = {
        interConflicts: new Set([1, 3, 5]),
      };

      const response = isInnerRowConflicted(av, 2);
      expect(response).toBe(false);
    });
  });
});

describe('outerRowSorter', () => {
  const a = {
    rows: [
      { startDate: '2022-09-22' },
      { startDate: '2022-09-24' },
      { startDate: '2022-09-26' },
    ]
  };
  const b = {
    rows: [
      { startDate: '2022-09-21' },
      { startDate: '2022-09-23' },
      { startDate: '2022-09-25' },
    ]
  };

  it('av[0] is greater', () => {
    const result = outerRowSorter(a, b);
    expect(result).toEqual(1);
  });

  it('av[1] is greater', () => {
    const result = outerRowSorter(b, a);
    expect(result).toEqual(-1);
  });
});

// describe('updateInnerRowState', () => { });

describe('updateRowState', () => {
  it('correctly updates given row', () => {
    const r1 = { foo: true, bar: false };
    const r2 = { foo: true, bar: false };
    const r3 = { foo: true, bar: false };
    const newState = { bat: true };

    const setRowStates = jest.fn();

    updateRowState([r1, r2, r3], setRowStates, 1, newState);

    expect(setRowStates).toHaveBeenCalledWith([r1, { ...r2, ...newState }, r3]);
  });
});
