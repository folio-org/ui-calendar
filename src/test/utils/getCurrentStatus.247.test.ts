import "@testing-library/jest-dom";
import { render as _render } from "@testing-library/react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { IntlShape } from "react-intl";
import getCurrentStatus, {
  getCurrentStatusNonFormatted,
} from "../../main/utils/getCurrentStatus";
import { LocaleWeekdayInfo } from "../../main/utils/WeekdayUtils";
import * as Calendars from "../config/data/Calendars";
import * as Dates from "../config/data/Dates";
import * as Weekdays from "../config/data/Weekdays";
import withIntlConfiguration from "../config/util/withIntlConfiguration";

const intl = {
  formatTime: jest.fn((t) => `||${dayjs(t).utc(false).format("HH:mm")}||`),
  formatDate: jest.fn((d) => `||${dayjs(d).utc(false).format("YYYY-MM-DD")}||`),
  formatMessage: jest.fn((m) => m.id),
} as unknown as IntlShape;

const localeWeekdays: LocaleWeekdayInfo[] = [
  { weekday: Weekdays.Sunday, short: "XXXXX", long: "||Sunday||" },
  { weekday: Weekdays.Monday, short: "XXXXX", long: "||Monday||" },
  { weekday: Weekdays.Tuesday, short: "XXXXX", long: "||Tuesday||" },
  { weekday: Weekdays.Wednesday, short: "XXXXX", long: "||Wednesday||" },
  { weekday: Weekdays.Thursday, short: "XXXXX", long: "||Thursday||" },
  { weekday: Weekdays.Friday, short: "XXXXX", long: "||Friday||" },
  { weekday: Weekdays.Saturday, short: "XXXXX", long: "||Saturday||" },
];

function render(el: ReactNode): HTMLElement {
  return _render(withIntlConfiguration(el)).container;
}

test("24/7 calendars return as expected", () => {
  expect(
    getCurrentStatusNonFormatted(
      intl,
      Dates.JUN_1,
      Calendars.ALL_YEAR_SP_ONLINE_247
    )
  ).toStrictEqual({
    open: true,
    exceptional: false,
  });
  expect(
    render(
      getCurrentStatus(
        intl,
        localeWeekdays,
        Dates.JUN_1,
        Calendars.ALL_YEAR_SP_ONLINE_247
      )
    ).textContent
  ).toBe("Open");
});
