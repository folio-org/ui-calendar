import translation from '../../../translations/ui-calendar/en';
import { moment } from '../../../src/settings/constants';

export const formatDateString = (string) => {
  const date = moment(string);

  return date.format(translation.dateFormat);
};

export const getRequiredLabel = (text, space = true) => `${text}${space ? ' ' : ''}*`;
