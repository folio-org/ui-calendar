import expectRender from '../../test/util/expectRender';
import {
  getErrorDisplay,
  getMainConflictError,
  isInnerRowConflicted,
  isOuterRowConflicted,
} from './ExceptionFieldUtils';

test('getMainConflictError gives proper responses', () => {
  expect(getMainConflictError(undefined)).toBeUndefined();
  expect(getMainConflictError([])).toBeUndefined();
  expect(getMainConflictError([{}])).toBeUndefined();
  expect(getMainConflictError([{ rows: [] }])).toBeUndefined();
  expect(getMainConflictError([{ conflict: true }])).not.toBeUndefined();
  expectRender(getMainConflictError([{ conflict: true }])).toContain(
    'Some exceptions have conflicts with each other'
  );
});

test('isInnerRowConflicted properly extracts from error object', () => {
  expect(isInnerRowConflicted(undefined, 0, 0)).toBe(false);
  expect(isInnerRowConflicted([], 0, 0)).toBe(false);
  expect(isInnerRowConflicted([{ rows: [] }], 0, 0)).toBe(false);
  expect(isInnerRowConflicted([{ rows: [{}] }], 0, 0)).toBe(false);
  expect(isInnerRowConflicted([{ rows: [{ conflict: true }] }], 0, 0)).toBe(
    true
  );
});

test('isOuterRowConflicted properly extracts from error object', () => {
  expect(isOuterRowConflicted(undefined, 0)).toBe(false);
  expect(isOuterRowConflicted([], 0)).toBe(false);
  expect(isOuterRowConflicted([{ rows: [] }], 0)).toBe(false);
  expect(isOuterRowConflicted([{ conflict: true, rows: [] }], 0)).toBe(true);
});

test('getErrorDisplay properly extracts from error object', () => {
  expect(getErrorDisplay(undefined, 0)).toBeUndefined();
  expect(getErrorDisplay([], 0)).toBeUndefined();
  expect(getErrorDisplay([{ rows: [] }], 0)).toBeUndefined();
  expect(getErrorDisplay([{ rows: [{}] }], 0)).toBeUndefined();
  expect(getErrorDisplay([{ rows: [{ startDate: 'foo' }] }], 0)).toEqual('foo');
  expect(getErrorDisplay([{ rows: [{}, { endDate: 'bar' }] }], 0)).toEqual(
    'bar'
  );
  expect(getErrorDisplay([{ rows: [{}, {}] }], 0)).toBeUndefined();
});
