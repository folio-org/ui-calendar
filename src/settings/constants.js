import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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
  '#e6194B'
];

export const permissions = {
  DELETE: 'calendar.periods.item.delete',
  POST: 'calendar.periods.item.post',
  PUT:  'calendar.periods.item.put'
};

export const ALL_DAY = <FormattedMessage id="ui-calendar.settings.allDay" />;


// createFromInputFallback fixes the deprecation warning: value provided is not in a recognized RFC2822 or ISO format
// eslint-disable-next-line func-names
moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};

export { moment };
