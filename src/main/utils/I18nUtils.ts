/* eslint-disable import/prefer-default-export */
import { IntlShape } from "react-intl";

export function formatList(intl: IntlShape, list: string[]): string {
  return intl.formatList(list);
}
