import moment from 'moment';

import {
  localizer,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const setTimezoneOffset = (date) => {
  const momentDate = moment(date);
  const utcOffset = -(momentDate.utcOffset() / 60);

  return momentDate.add(utcOffset, 'hours');
};

/**
 * Returns list of week days. First week day is based on user locale if locale is passed
 * and SUNDAY if locale is not passed
 * @param {string|null|undefined} locale - Locale code. Examples: en, en-US
 * @returns {string[]} - List of week days. Example:
 * ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
 */
export const getWeekDays = (locale) => {
  const weekDays = [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY];

  if (!locale) {
    return weekDays;
  }

  const movedDays = weekDays.splice(0, localizer.startOfWeek(locale));

  return [...weekDays, ...movedDays];
};
