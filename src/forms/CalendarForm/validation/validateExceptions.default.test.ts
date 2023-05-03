import RowType from '../../../components/fields/RowType';
import validateExceptions from './validateExceptions';

test('No rows returns {}', () => {
  expect(validateExceptions(undefined, undefined, undefined)).toStrictEqual({});
  expect(validateExceptions([], undefined, undefined)).toStrictEqual({});
});

test('Only valid start/end dates returns date bound issues {}', () => {
  expect(
    validateExceptions(
      [
        {
          name: 'foo',
          type: RowType.Open,
          rows: [
            {
              startDate: '2000-12-01',
              startTime: '00:00',
              endDate: '2000-12-31',
              endTime: '00:00',
            },
          ],
        },
      ],
      '2000-12-15',
      '2000-12-31'
    )
  ).toHaveProperty([0, 'rows', 0, 'startDate']);
  expect(
    validateExceptions(
      [
        {
          name: 'foo',
          type: RowType.Open,
          rows: [
            {
              startDate: '2000-12-01',
              startTime: '00:00',
              endDate: '2000-12-31',
              endTime: '00:00',
            },
          ],
        },
      ],
      undefined,
      '2000-12-31'
    )
  ).not.toHaveProperty([0, 'rows', 0, 'startDate']);
});
