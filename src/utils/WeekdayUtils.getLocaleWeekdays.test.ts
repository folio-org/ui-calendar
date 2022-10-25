import { renderHook } from '@testing-library/react-hooks';
import { IntlShape } from 'react-intl';
import * as Weekdays from '../test/data/Weekdays';
import getIntl from '../test/util/getIntl';
import { getLocaleWeekdays, useLocaleWeekdays } from './WeekdayUtils';

// United States
let intlEn: IntlShape;
// France
let intlFr: IntlShape;
// Algeria
let intlAr: IntlShape;

beforeAll(() => {
  intlEn = getIntl('en-US', 'EST');
  intlFr = getIntl('fr-FR', 'CET');
  intlAr = getIntl('ar-DZ', 'CET');
});

test('Locale weekdays are properly retrieved', () => {
  expect(getLocaleWeekdays(intlEn)).toStrictEqual([
    { weekday: Weekdays.Sunday, long: 'Sunday', short: 'Sun' },
    { weekday: Weekdays.Monday, long: 'Monday', short: 'Mon' },
    { weekday: Weekdays.Tuesday, long: 'Tuesday', short: 'Tue' },
    { weekday: Weekdays.Wednesday, long: 'Wednesday', short: 'Wed' },
    { weekday: Weekdays.Thursday, long: 'Thursday', short: 'Thu' },
    { weekday: Weekdays.Friday, long: 'Friday', short: 'Fri' },
    { weekday: Weekdays.Saturday, long: 'Saturday', short: 'Sat' }
  ]);
  expect(getLocaleWeekdays(intlFr)).toStrictEqual([
    { weekday: Weekdays.Monday, long: 'lundi', short: 'lun.' },
    { weekday: Weekdays.Tuesday, long: 'mardi', short: 'mar.' },
    { weekday: Weekdays.Wednesday, long: 'mercredi', short: 'mer.' },
    { weekday: Weekdays.Thursday, long: 'jeudi', short: 'jeu.' },
    { weekday: Weekdays.Friday, long: 'vendredi', short: 'ven.' },
    { weekday: Weekdays.Saturday, long: 'samedi', short: 'sam.' },
    { weekday: Weekdays.Sunday, long: 'dimanche', short: 'dim.' }
  ]);
  expect(getLocaleWeekdays(intlAr)).toStrictEqual([
    { weekday: Weekdays.Saturday, long: 'السبت', short: 'السبت' },
    { weekday: Weekdays.Sunday, long: 'الأحد', short: 'الأحد' },
    { weekday: Weekdays.Monday, long: 'الاثنين', short: 'الاثنين' },
    { weekday: Weekdays.Tuesday, long: 'الثلاثاء', short: 'الثلاثاء' },
    { weekday: Weekdays.Wednesday, long: 'الأربعاء', short: 'الأربعاء' },
    { weekday: Weekdays.Thursday, long: 'الخميس', short: 'الخميس' },
    { weekday: Weekdays.Friday, long: 'الجمعة', short: 'الجمعة' }
  ]);
});

test('useLocaleWeekdays hook works like getLocaleWeekdays', () => {
  let intlToTest = intlEn;
  const { result, rerender } = renderHook(() => useLocaleWeekdays(intlToTest));

  intlToTest = intlEn;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Sunday, long: 'Sunday', short: 'Sun' },
    { weekday: Weekdays.Monday, long: 'Monday', short: 'Mon' },
    { weekday: Weekdays.Tuesday, long: 'Tuesday', short: 'Tue' },
    { weekday: Weekdays.Wednesday, long: 'Wednesday', short: 'Wed' },
    { weekday: Weekdays.Thursday, long: 'Thursday', short: 'Thu' },
    { weekday: Weekdays.Friday, long: 'Friday', short: 'Fri' },
    { weekday: Weekdays.Saturday, long: 'Saturday', short: 'Sat' }
  ]);

  intlToTest = intlFr;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Monday, long: 'lundi', short: 'lun.' },
    { weekday: Weekdays.Tuesday, long: 'mardi', short: 'mar.' },
    { weekday: Weekdays.Wednesday, long: 'mercredi', short: 'mer.' },
    { weekday: Weekdays.Thursday, long: 'jeudi', short: 'jeu.' },
    { weekday: Weekdays.Friday, long: 'vendredi', short: 'ven.' },
    { weekday: Weekdays.Saturday, long: 'samedi', short: 'sam.' },
    { weekday: Weekdays.Sunday, long: 'dimanche', short: 'dim.' }
  ]);

  intlToTest = intlAr;
  rerender();
  expect(result.current).toStrictEqual([
    { weekday: Weekdays.Saturday, long: 'السبت', short: 'السبت' },
    { weekday: Weekdays.Sunday, long: 'الأحد', short: 'الأحد' },
    { weekday: Weekdays.Monday, long: 'الاثنين', short: 'الاثنين' },
    { weekday: Weekdays.Tuesday, long: 'الثلاثاء', short: 'الثلاثاء' },
    { weekday: Weekdays.Wednesday, long: 'الأربعاء', short: 'الأربعاء' },
    { weekday: Weekdays.Thursday, long: 'الخميس', short: 'الخميس' },
    { weekday: Weekdays.Friday, long: 'الجمعة', short: 'الجمعة' }
  ]);
});
