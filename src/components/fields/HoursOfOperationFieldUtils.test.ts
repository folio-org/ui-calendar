import expectRender from '../../test/util/expectRender';
import {
  getConflictError,
  isRowConflicted,
} from './HoursOfOperationFieldUtils';

test('isRowConflicted returns proper check', () => {
  expect(isRowConflicted(undefined, 0)).toBe(false);
  expect(isRowConflicted([], 0)).toBe(false);
  expect(isRowConflicted([{}], 0)).toBe(false);
  expect(isRowConflicted([{ conflict: true }], 0)).toBe(true);
  expect(isRowConflicted([{ conflict: true }], 1)).toBe(false);
  expect(isRowConflicted([{}, { conflict: true }], 0)).toBe(false);
  expect(isRowConflicted([{}, { conflict: true }], 1)).toBe(true);
});

test('getConflictError returns appropriate message', () => {
  expect(getConflictError(undefined)).toBeUndefined();
  expect(getConflictError([])).toBeUndefined();
  expectRender(getConflictError([{ conflict: true }])).toContain(
    'Some openings have conflicts with each other'
  );
});
