import { render, screen } from '@testing-library/react'
import React from 'react'
import MCLRowFormatter from './MCLRowFormatter'
import { MCLContentsType } from './ExceptionFieldTypes';
import RowType from './RowType';

describe('MCLRowFormatter', () => {
  it('Renders the formatter correctly', async () => {
    render(
      <MCLRowFormatter<MCLContentsType>
        rowClass='test-classname'
        rowWidth={1}
        rowIndex={1}
        labelStrings={['foo']}
        cells={[<h1 key='foo'>test</h1>]}
        rowData={
          { rowState:
            { i: 1,
              name: 'foo',
              type: RowType.Open,
              lastRowI: 1,
              rows: [{
                i: 1,
                startDate: undefined,
                startTime: undefined,
                endDate: undefined,
                endTime: undefined
              }]
            },
            name: undefined,
            status: undefined,
            startDate: undefined,
            startTime: undefined,
            endDate: undefined,
            endTime: undefined,
            actions: undefined,
            isConflicted: false
          }
        }
        rowProps={{} as any}
      />
    );
  
    expect(await screen.findByRole('heading')).toBeInTheDocument();
    expect((await screen.findByRole('heading')).textContent).toBe('test');
    expect((await screen.findByRole('heading')).parentElement?.className).toBe('test-classname');
  });
});
