import moment from 'moment';

export const formatDateString = (string) => {
  const date = moment.utc(string);

  return date.format('MM/DD/YYYY');
};

export const formatDisplayDateString = (string) => {
  const date = moment.utc(string);

  return date.format('M/D/YYYY');
};

export const getRequiredLabel = (text, space = true) => `${text}${space ? ' ' : ''}*`;
