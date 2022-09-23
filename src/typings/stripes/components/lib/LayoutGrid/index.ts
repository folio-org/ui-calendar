/* eslint-disable max-classes-per-file */
import type { ReactNode } from 'react';
import { Component } from 'react';
import type { GridProps, RowProps, ColProps } from 'react-flexbox-grid';

export class Grid extends Component<
  GridProps & {
    children?: ReactNode;
  }
> {}
export class Row extends Component<
  RowProps & {
    children?: ReactNode;
  }
> {}
export class Col extends Component<
  ColProps & {
    children?: ReactNode;
  }
> {}
