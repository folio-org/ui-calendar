import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

export const MOCKED_DATE = "2022-05-14";
export const MOCKED_DATE_OBJ = dayjs(MOCKED_DATE);
export const MOCKED_DATE_TIME = "2022-05-17 17:01:00";
export const MOCKED_DATE_TIME_OBJ = dayjs(MOCKED_DATE_TIME);
