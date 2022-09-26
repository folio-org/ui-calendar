import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

export const colors = [
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#42d4f4',
  '#f032e6',
  '#bfef45',
  '#fabebe',
  '#469990',
  '#e6beff',
  '#9A6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#a9a9a9',
  '#ffffff',
  '#000000',
  '#e6194B',
];

export const permissions = {
  DELETE: 'calendar.periods.item.delete',
  POST: 'calendar.periods.item.post',
  PUT:  'calendar.periods.item.put',
};

export const ALL_DAY = <FormattedMessage id="ui-calendar.settings.allDay" />;

export const MAX_RECORDS = '10000';

export const localizer = momentLocalizer(moment);

export const MONDAY = 'MONDAY';
export const TUESDAY = 'TUESDAY';
export const WEDNESDAY = 'WEDNESDAY';
export const THURSDAY = 'THURSDAY';
export const FRIDAY = 'FRIDAY';
export const SATURDAY = 'SATURDAY';
export const SUNDAY = 'SUNDAY';
