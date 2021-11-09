import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const setTimezoneOffset = (date) => {
  const momentDate = moment(date);
  const utcOffset = -(momentDate.utcOffset() / 60);

  return momentDate.add(utcOffset, 'hours');
};
