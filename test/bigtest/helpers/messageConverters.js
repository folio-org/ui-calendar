import moment from 'moment';
import translation from '../../../translations/ui-calendar/en';

export const formatDateString = (string) => {
  const date = moment.utc(string);

  return date.format(translation.dateFormat);
};

export const getRequiredLabel = (text, space = true) => `${text}${space ? ' ' : ''}*`;
