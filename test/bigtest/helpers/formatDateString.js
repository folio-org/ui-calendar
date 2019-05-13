const options = {
  day: '2-digit',
  year: 'numeric',
  month: '2-digit',
};

export default (string, locales = 'en-US') => {
  const date = new Date(string);

  return date.toLocaleDateString(locales, options);
};
