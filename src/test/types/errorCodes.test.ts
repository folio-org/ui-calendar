import { ErrorCode } from '../../main/types/types';

// needed for coverage, for some reason
test('Errors are properly loaded', () => {
  expect(ErrorCode.INTERNAL_SERVER_ERROR).toBe('internalServerError');
});
