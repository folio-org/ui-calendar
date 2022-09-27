import {
  flipSortDirection,
  getInitialSort,
  sortBy,
  SortDirection
} from './SortableMultiColumnList';

describe('flipSortDirection', () => {
  it('flips descending to ascending. were you expecting something else?', () => {
    expect(flipSortDirection(SortDirection.DESCENDING)).toBe(SortDirection.ASCENDING);
  });

  it('flips descending to ascending. were you expecting something else?', () => {
    expect(flipSortDirection(SortDirection.ASCENDING)).toBe(SortDirection.DESCENDING);
  });
});

describe('getInitialSort', () => {
  it('returns empty without "sortedColumn"', () => {
    expect(getInitialSort().length).toBe(0);
  });

  it('returns array in the expected shape (descending)', () => {
    expect(getInitialSort('a', 'descending')[0]).toMatchObject({ 'key': 'a', 'direction': SortDirection.DESCENDING });
  });

  it('returns array in the expected shape (ascending)', () => {
    expect(getInitialSort('a', 'ascending')[0]).toMatchObject({ 'key': 'a', 'direction': SortDirection.ASCENDING });
  });

  it('returns array in the expected shape (default, ascending)', () => {
    expect(getInitialSort('a', 'monkey')[0]).toMatchObject({ 'key': 'a', 'direction': SortDirection.ASCENDING });
  });
});

describe('sortBy', () => {
  it('sorts when fields are present', () => {
    const a = { name: 'angela' };
    const b = { name: 'beatrice' };
    const c = { name: 'chloe' };
    const d = { name: 'dara' };
    const data = [a, b, c, d];
    const key = 'name';
    const direction = SortDirection.DESCENDING;
    const dateColumns = [];
    const dateColumnMap = {};

    sortBy(data, key, direction, dateColumns, dateColumnMap);
    expect(data[0]).toMatchObject(d);
    expect(data[1]).toMatchObject(c);
    expect(data[2]).toMatchObject(b);
    expect(data[3]).toMatchObject(a);
  });

  it('sorts by date', () => {
    const a = { beginDate: new Date('2022-09-01T01:02:03Z') };
    const b = { beginDate: new Date('2022-09-02T01:02:03Z') };
    const c = { beginDate: new Date('2022-09-03T01:02:03Z') };
    const d = { beginDate: new Date('2022-09-04T01:02:03Z') };
    const data = [a, b, c, d];
    const key = 'beginDate';
    const direction = SortDirection.DESCENDING;
    const dateColumns = ['beginDate'];
    const dateColumnMap = { beginDate: 'beginDate' };

    sortBy(data, key, direction, dateColumns, dateColumnMap);
    expect(data[0]).toMatchObject(d);
    expect(data[1]).toMatchObject(c);
    expect(data[2]).toMatchObject(b);
    expect(data[3]).toMatchObject(a);
  });

  it('sorts by date (mapped)', () => {
    const a = { formattedDate: 'Thursday', beginDate: new Date('2022-09-01T01:02:03Z') };
    const b = { formattedDate: 'Friday', beginDate: new Date('2022-09-02T01:02:03Z') };
    const c = { formattedDate: 'Saturday', beginDate: new Date('2022-09-03T01:02:03Z') };
    const d = { formattedDate: 'Sunday', beginDate: new Date('2022-09-04T01:02:03Z') };
    const data = [c, d, b, a];
    const key = 'formattedDate';
    const direction = SortDirection.ASCENDING;
    const dateColumns = ['formattedDate'];
    const dateColumnMap = { formattedDate: 'beginDate' };

    sortBy(data, key, direction, dateColumns, dateColumnMap);
    expect(data[0]).toMatchObject(a);
    expect(data[1]).toMatchObject(b);
    expect(data[2]).toMatchObject(c);
    expect(data[3]).toMatchObject(d);
  });

  it('nulls sink to the bottom (DESCENDING)', () => {
    const a = { fname: 'angela' };
    const b = { name: 'beatrice' };
    const c = { name: 'chloe' };
    const data = [a, b, c];
    const key = 'name';
    const direction = SortDirection.DESCENDING;
    const dateColumns = [];
    const dateColumnMap = {};

    sortBy(data, key, direction, dateColumns, dateColumnMap);
    expect(data[0]).toMatchObject(c);
    expect(data[1]).toMatchObject(b);
    expect(data[2]).toMatchObject(a);
  });

  it('nulls float to the top (ASCENDING)', () => {
    const a = { fname: 'angela' };
    const b = { name: 'beatrice' };
    const c = { name: 'chloe' };
    const data = [a, b, c];
    const key = 'fname';
    const direction = SortDirection.ASCENDING;
    const dateColumns = [];
    const dateColumnMap = {};

    sortBy(data, key, direction, dateColumns, dateColumnMap);
    expect(data[2]).toMatchObject(a);
  });
});
