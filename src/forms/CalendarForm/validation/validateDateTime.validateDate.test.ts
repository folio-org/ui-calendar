import { validateDate } from './validateDateTime';
import expectRender from '../../../test/util/expectRender';

const localeDateFormat = 'MM/DD/YYYY';

test('Missing ref results in no error (caught elsewhere)', () => {
  expect(
    validateDate({}, 'start-date', { current: null }, localeDateFormat)
  ).toStrictEqual({});
});

test('Missing or empty value results in missing error', () => {
  const ref = { current: document.createElement('input') };
  ref.current.value = '';

  let validationResult = validateDate({}, 'start-date', ref, localeDateFormat);
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please fill this in to continue'
  );

  validationResult = validateDate({}, 'start-date', ref, localeDateFormat);
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please fill this in to continue'
  );

  validationResult = validateDate(
    { 'start-date': undefined },
    'start-date',
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please fill this in to continue'
  );
});

test('Proper inputs results in no error', () => {
  const ref = { current: document.createElement('input') };
  ref.current.value = '11/22/2000';

  expect(
    validateDate(
      { 'start-date': '2000-11-22' },
      'start-date',
      ref,
      localeDateFormat
    )
  ).toStrictEqual({});
});

test('Improper inputs results in no error', () => {
  const ref = { current: document.createElement('input') };

  ref.current.value = '01/01/2000';

  let validationResult = validateDate(
    { 'start-date': '2000-11-22' },
    'start-date',
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please enter a date in the MM/DD/YYYY format'
  );

  validationResult = validateDate(
    { 'start-date': 'invalid' },
    'start-date',
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please enter a date in the MM/DD/YYYY format'
  );

  ref.current.value = 'invalid';
  validationResult = validateDate(
    { 'start-date': '2000-11-22' },
    'start-date',
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please enter a date in the MM/DD/YYYY format'
  );

  // input field should be locale format
  ref.current.value = '2000-11-22';
  validationResult = validateDate(
    { 'start-date': '2000-11-22' },
    'start-date',
    ref,
    localeDateFormat
  );
  expect(validationResult).toHaveProperty('start-date');
  expectRender(validationResult['start-date']).toBe(
    'Please enter a date in the MM/DD/YYYY format'
  );
});
