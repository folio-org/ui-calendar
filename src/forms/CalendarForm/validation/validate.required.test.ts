import expectRender from '../../../test/util/expectRender';
import validate from './validate';

test('Required does not error when the value is present', () => {
  expect(validate({ name: 'Foo' })).not.toHaveProperty('name');
});

test('Required returns error when the value is missing or undefined', () => {
  expect(validate({})).toHaveProperty('name');
  expect(validate({ name: undefined })).toHaveProperty('name');
});

test('Required returns error when the value is a whitespace string', () => {
  expect(validate({ name: '  ' })).toHaveProperty('name');
  expect(validate({ name: ' \t\t ' })).toHaveProperty('name');
  expect(validate({ name: ' \tfoo\t ' })).not.toHaveProperty('name');
});

test('Required returns error when the value is an empty array', () => {
  // solely for testing, as required is not directly exposed
  expect(validate({ name: [] as unknown as string })).toHaveProperty('name');
  expect(
    validate({
      name: ['', undefined] as unknown as string,
    })
  ).toHaveProperty('name');
  expect(
    validate({
      name: ['foo'] as unknown as string,
    })
  ).not.toHaveProperty('name');
});

test('Required error has the expected translation', () => {
  const validationResult = validate({});
  expect(validationResult).toHaveProperty('name');

  expectRender(validationResult.name).toBe('Please fill this in to continue');
});
