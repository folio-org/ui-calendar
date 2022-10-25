import type { StripesType } from '@folio/stripes/core';
import ifPermissionOr from './ifPermissionOr';

test('IfPermissionOr properly matches permissions', () => {
  const testNode = 'test';
  let perms: string[] = [];

  const stripes = {
    hasPerm: jest.fn((p) => perms.indexOf(p) !== -1),
  } as unknown as StripesType;

  expect(ifPermissionOr(stripes, ['a'], testNode)).toBeNull();

  perms = ['a'];

  expect(ifPermissionOr(stripes, ['a'], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ['a', 'b'], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ['b', 'c'], testNode)).toBeNull();

  perms = ['a', 'b'];

  expect(ifPermissionOr(stripes, ['a'], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ['b'], testNode)).toBe(testNode);
  expect(ifPermissionOr(stripes, ['a', 'b'], testNode)).toBe(testNode);
});
