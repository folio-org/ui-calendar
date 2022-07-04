/* eslint-disable import/prefer-default-export */
import { IntlShape } from "react-intl";

export function formatList(intl: IntlShape, list: string[]): string {
  switch (list.length) {
    case 0:
      return "";
    case 1:
      return list[0];
    case 2:
      return (
        list[0] +
        intl.formatMessage({ id: "ui-calendar.list.twoSeparator" }) +
        list[1]
      );
    default: {
      let str = list[0];
      for (let i = 1; i < list.length; i++) {
        if (i === list.length - 1) {
          str += intl.formatMessage({
            id: "ui-calendar.list.threeOrMoreLastSeparator",
          });
        } else {
          str += intl.formatMessage({
            id: "ui-calendar.list.threeOrMoreSeparator",
          });
        }
        str += list[i];
      }
      return str;
    }
  }
}
