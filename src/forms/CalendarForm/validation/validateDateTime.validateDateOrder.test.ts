import expectRender from '../../../test/util/expectRender';
import { validateDateOrder } from './validateDateTime';

test('Missing values results in no error (caught elsewhere)', () => {
  expect(validateDateOrder({})).toStrictEqual({});
  expect(validateDateOrder({ 'start-date': undefined })).not.toHaveProperty(
    'end-date'
  );
  expect(validateDateOrder({ 'start-date': '', 'end-date': '' })).toStrictEqual(
    {}
  );
  expect(
    validateDateOrder({ 'start-date': 'foo', 'end-date': '' })
  ).toStrictEqual({});
  expect(
    validateDateOrder({ 'start-date': 'foo', 'end-date': undefined })
  ).toStrictEqual({});
  expect(
    validateDateOrder({ 'start-date': undefined, 'end-date': 'bar' })
  ).toStrictEqual({});
});

test('Date order is properly checked', () => {
  expect(
    validateDateOrder({ 'start-date': '2000-01-01', 'end-date': '2222-12-22' })
  ).toStrictEqual({});
  expect(
    validateDateOrder({ 'start-date': '2000-01-02', 'end-date': '2000-01-01' })
  ).toHaveProperty('end-date');
});

test('Error message contains proper translation', () => {
  const validationResult = validateDateOrder({
    'start-date': '2000-01-02',
    'end-date': '2000-01-01',
  });
  expect(validationResult).toHaveProperty('end-date');

  expectRender(validationResult['end-date']).toBe(
    'End date must not be before the start date'
  );
});
