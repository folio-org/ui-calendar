import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  getLocaleDateFormat,
  getLocalizedTimeFormatInfo,
  Row,
  TextField,
} from "@folio/stripes-components";
import { DatepickerFieldRenderProps as DateFieldRenderProps } from "@folio/stripes-components/types/lib/Datepicker/Datepicker";
import { TextFieldRenderProps } from "@folio/stripes-components/types/lib/TextField/TextField";
import { CalloutContext } from "@folio/stripes-core";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormApi, SubmissionErrors } from "final-form";
import memoizee from "memoizee";
import React, {
  FunctionComponent,
  ReactNode,
  RefObject,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Field, Form } from "react-final-form";
import { useIntl } from "react-intl";
import { CalendarOpening, ServicePoint, Weekday } from "../types/types";
import { getWeekdaySpan, overlaps } from "./CalendarUtils";
import HoursOfOperationField from "./fields/HoursOfOperationField";
import {
  HoursOfOperationErrors,
  HoursOfOperationRowState,
} from "./fields/HoursOfOperationFieldTypes";
import { CALENDARS } from "./MockConstants";
import ServicePointAssignmentField from "./fields/ServicePointAssignmentField";
import RowType from "./fields/RowType";

dayjs.extend(customParseFormat);

const TextFieldComponent = TextField<string, TextFieldRenderProps<string>>;
const DateFieldComponent = DateField<DateFieldRenderProps>;

export const FORM_ID = "ui-calendar-create-calendar-form";

interface FormValues {
  name: string;
  "start-date": string;
  "end-date": string;
  "service-points": ServicePoint[];
  "hours-of-operation": HoursOfOperationRowState[];
}

type SimpleErrorFormValues = Omit<FormValues, "hours-of-operation">;

function required(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues
): {
  [key in keyof SimpleErrorFormValues]?: ReactNode;
} {
  if (
    !(key in values) ||
    values[key] === undefined ||
    (typeof values[key] === "string" && values[key] === "") ||
    (Array.isArray(values[key]) && (values[key] as unknown[]).length === 0)
  ) {
    return {
      [key]: "Please fill this in to continue",
    };
  }
  return {};
}

function isTimeProper(
  localeTimeFormat: string,
  fieldValue: string,
  realInputValue: string
): boolean {
  const timeObject = dayjs(realInputValue, localeTimeFormat, true);
  return !timeObject.isValid() || timeObject.format("HH:mm") !== fieldValue;
}

// ensure manually-typed dates match the proper format
function validateDate(
  values: Partial<FormValues>,
  key: keyof SimpleErrorFormValues,
  dateRef: RefObject<HTMLInputElement>,
  localeDateFormat: string
): Partial<{
  [key in keyof SimpleErrorFormValues]?: ReactNode;
}> {
  if (dateRef.current === null) {
    return {};
  }

  if (
    dateRef.current.value === "" &&
    (!(key in values) || typeof values[key] !== "string")
  ) {
    return {
      [key]: "Please fill this in to continue",
    };
  }

  const dateValue = values[key] as string;
  const inputValue = dateRef.current.value;

  if (dayjs(dateValue).format(localeDateFormat) !== inputValue) {
    return {
      [key]: `Please ender a date in the ${localeDateFormat} format`,
    };
  }

  return {};
}

// ensure start-date and end-date are in the proper order
// if improper, renders an error on `end-date`
function validateDateOrder(values: Partial<FormValues>): {
  "end-date"?: ReactNode;
} {
  if (
    typeof values["start-date"] === "string" &&
    values["start-date"] !== "" &&
    typeof values["end-date"] === "string" &&
    values["end-date"] !== "" &&
    values["end-date"] < values["start-date"]
  ) {
    return {
      "end-date": "End date must not be before the start date",
    };
  }
  return {};
}

function validateHoursOfOperation(
  rows: HoursOfOperationRowState[] | undefined,
  timeFieldRefs: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  },
  localeTimeFormat: string
): {
  "hours-of-operation"?: HoursOfOperationErrors;
} {
  if (rows === undefined) return {};

  const emptyErrors: HoursOfOperationErrors["empty"] = {
    startDay: {},
    startTime: {},
    endDay: {},
    endTime: {},
  };

  rows.forEach((row) => {
    if (row.startDay === undefined) {
      emptyErrors.startDay[row.i] = "Please fill this in to continue";
    }
    if (row.endDay === undefined) {
      emptyErrors.endDay[row.i] = "Please fill this in to continue";
    }
    if (row.type === RowType.Open) {
      if (row.startTime === undefined || !(row.i in timeFieldRefs.startTime)) {
        emptyErrors.startTime[row.i] = "Please fill this in to continue";
      }
      if (row.endTime === undefined || !(row.i in timeFieldRefs.endTime)) {
        emptyErrors.endTime[row.i] = "Please fill this in to continue";
      }
    }
  });

  if (
    Object.values(emptyErrors.startDay).length ||
    Object.values(emptyErrors.startTime).length ||
    Object.values(emptyErrors.endDay).length ||
    Object.values(emptyErrors.endTime).length
  ) {
    return { "hours-of-operation": { empty: emptyErrors } };
  }

  const invalidTimeErrors: HoursOfOperationErrors["invalidTimes"] = {
    startTime: {},
    endTime: {},
  };

  rows.forEach((row) => {
    if (row.type === RowType.Closed) {
      return;
    }
    if (
      isTimeProper(
        localeTimeFormat,
        row.startTime as string,
        timeFieldRefs.startTime[row.i]?.value
      )
    ) {
      invalidTimeErrors.startTime[
        row.i
      ] = `Please ender a date in the ${localeTimeFormat} format`;
    }
    if (
      isTimeProper(
        localeTimeFormat,
        row.endTime as string,
        timeFieldRefs.endTime[row.i]?.value
      )
    ) {
      invalidTimeErrors.endTime[
        row.i
      ] = `Please ender a date in the ${localeTimeFormat} format`;
    }
  });

  if (
    Object.values(invalidTimeErrors.startTime).length ||
    Object.values(invalidTimeErrors.endTime).length
  ) {
    return { "hours-of-operation": { invalidTimes: invalidTimeErrors } };
  }

  const split: Record<Weekday, { start: Dayjs; end: Dayjs; row: number }[]> = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };
  const baseDay = dayjs();
  const baseStart = baseDay.startOf("day");
  const baseEnd = baseDay.endOf("day");

  rows.forEach((row: HoursOfOperationRowState, rowIndex) => {
    const opening: CalendarOpening = {
      startDay: row.startDay as Weekday,
      startTime:
        row.type === RowType.Open ? (row.startTime as string) : "00:00",
      endDay: row.endDay as Weekday,
      endTime: row.type === RowType.Open ? (row.endTime as string) : "23:59",
    };

    const span = getWeekdaySpan(opening);
    span.forEach((weekday) => {
      let start = baseStart;
      let end = baseEnd;

      const startTime = opening.startTime
        .split(":")
        .map((num) => parseInt(num, 10)) as [number, number];
      const endTime = opening.endTime
        .split(":")
        .map((num) => parseInt(num, 10)) as [number, number];

      if (row.i === 0) {
        start = start.hour(startTime[0]).minute(startTime[1]);
      }
      if (row.i === span.length - 1) {
        end = end.hour(endTime[0]).minute(endTime[1]);
      }

      split[weekday].push({
        start,
        end,
        row: rowIndex,
      });
    });
  });

  const conflicts = new Set<number>();

  Object.values(split).forEach((timeRanges) => {
    for (let i = 0; i < timeRanges.length - 1; i++) {
      for (let j = i + 1; j < timeRanges.length; j++) {
        if (
          overlaps(
            timeRanges[i].start,
            timeRanges[i].end,
            timeRanges[j].start,
            timeRanges[j].end
          )
        ) {
          conflicts.add(timeRanges[i].row);
          conflicts.add(timeRanges[j].row);
        }
      }
    }
  });

  if (conflicts.size) {
    return { "hours-of-operation": { conflicts } };
  }

  return {};
}

function validate(
  localeDateFormat: string,
  localeTimeFormat: string,
  dateRefs: {
    startDateRef: RefObject<HTMLInputElement>;
    endDateRef: RefObject<HTMLInputElement>;
  },
  hoursOfOperationTimeFieldRefs: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  },
  values: Partial<FormValues>
): Partial<
  {
    "hours-of-operation": HoursOfOperationErrors;
  } & {
    [key in keyof SimpleErrorFormValues]: ReactNode;
  }
> {
  // in reverse order of priority, later objects will unpack on top of earlier ones
  // therefore, required should take precedence over any other errors
  return {
    ...validateHoursOfOperation(
      values["hours-of-operation"],
      hoursOfOperationTimeFieldRefs,
      localeTimeFormat
    ),
    ...validateDateOrder(values),
    ...required(values, "name"),
    ...validateDate(
      values,
      "start-date",
      dateRefs.startDateRef,
      localeDateFormat
    ),
    ...validateDate(values, "end-date", dateRefs.endDateRef, localeDateFormat),
  };
}

export interface CreateCalendarFormProps {
  closeParentLayer: () => void;
  setIsSubmitting: (isSaving: boolean) => void;
  servicePoints: ServicePoint[];
}

export const CreateCalendarForm: FunctionComponent<CreateCalendarFormProps> = (
  props: CreateCalendarFormProps
) => {
  const calloutContext = useContext(CalloutContext);

  const onSubmit = (
    values: FormValues,
    form: FormApi<FormValues>,
    callback?: (errors?: SubmissionErrors) => void
  ): SubmissionErrors | Promise<SubmissionErrors> | void => {
    if (form.getState().hasValidationErrors) {
      return undefined;
    }

    console.table({
      values,
      form,
      callback,
    });

    props.setIsSubmitting(true);

    return new Promise((resolve) =>
      setTimeout(() => {
        calloutContext.sendCallout({
          message: "Test Callout error",
          type: "error",
        });
        props.setIsSubmitting(false);
        if (form.getState().errors?.aaaaaaaa !== undefined) {
          props.closeParentLayer();
        }

        resolve({ name: "foo" });
      }, 500)
    );
    // props.closeParentLayer();
    // return new Promise<void>((reject) => reject());
  };

  // TODO: not this
  const processInitialValues = memoizee(
    (initialValues: Partial<FormValues>): Partial<FormValues> => ({
      ...initialValues,
      "hours-of-operation": CALENDARS[3].openings.map(
        (opening, i): HoursOfOperationRowState => ({
          type: RowType.Open,
          i: -1 - i, // ensure `i` is negative as not to conflict
          ...opening,
        })
      ),
    })
  );

  const intl = useIntl();
  const localeDateFormat = getLocaleDateFormat({ intl });
  const localeTimeFormat = getLocalizedTimeFormatInfo(intl.locale).timeFormat;

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const hoursOfOperationTimeFieldRefs = useRef<{
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  }>({ startTime: [], endTime: [] });

  const validationFunction = useMemo(
    () =>
      validate.bind(
        this,
        localeDateFormat,
        localeTimeFormat,
        { startDateRef, endDateRef },
        hoursOfOperationTimeFieldRefs.current
      ),
    [localeDateFormat, localeTimeFormat, startDateRef, endDateRef]
  );

  return (
    <Form<FormValues>
      // submitting={foo}
      onSubmit={onSubmit}
      validate={validationFunction}
      validateOnBlur
      render={(params) => {
        const {
          handleSubmit,
          errors,
          submitErrors,
          touched,
          dirtyFieldsSinceLastSubmit,
          active,
          initialValues: _initialValues,
        } = params;

        const initialValues = processInitialValues(_initialValues);

        return (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton />
                </Col>
              </Row>
              <Accordion label="General information">
                <Row>
                  <Col xs={12} md={6}>
                    <Field
                      component={TextFieldComponent}
                      backendDateStandard="YYYY-MM-DD"
                      autoFocus
                      required
                      name="name"
                      label="Calendar name"
                      error={
                        (!dirtyFieldsSinceLastSubmit?.name &&
                          submitErrors?.name) ||
                        (touched?.name && active !== "name" && errors?.name)
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      inputRef={startDateRef}
                      backendDateStandard="YYYY-MM-DD"
                      required
                      usePortal
                      name="start-date"
                      label="Start date"
                      error={
                        (!dirtyFieldsSinceLastSubmit?.["start-date"] &&
                          submitErrors?.["start-date"]) ||
                        (touched?.["start-date"] &&
                          active !== "start-date" &&
                          errors?.["start-date"])
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      inputRef={endDateRef}
                      required
                      usePortal
                      name="end-date"
                      label="End date"
                      error={
                        (!dirtyFieldsSinceLastSubmit?.["end-date"] &&
                          submitErrors?.["end-date"]) ||
                        (touched?.["end-date"] &&
                          active !== "end-date" &&
                          errors?.["end-date"])
                      }
                    />
                  </Col>
                </Row>
                <ServicePointAssignmentField
                  servicePoints={props.servicePoints}
                />
              </Accordion>
              <Accordion label="Hours of operation">
                <Field
                  name="hours-of-operation"
                  component={HoursOfOperationField}
                  timeFieldRefs={hoursOfOperationTimeFieldRefs.current}
                  error={errors?.["hours-of-operation"]}
                  initialValue={initialValues["hours-of-operation"]}
                  localeTimeFormat={localeTimeFormat}
                />
              </Accordion>
              {/* <Accordion label="Exceptions">
                <MultiColumnList
                  interactive={false}
                  onHeaderClick={() => ({})}
                  getCellClass={(defaultClass) =>
                    `${defaultClass} ${css.flexAlignStart}`
                  }
                  columnMapping={{
                    name: "Name",
                    status: "Status",
                    startDate: "Start date",
                    startTime: "Start time",
                    endDate: "End date",
                    endTime: "End time",
                    actions: "Actions",
                  }}
                  columnWidths={{
                    name: "22%",
                    status: "12%",
                    startDate: "15%",
                    startTime: "15%",
                    endDate: "15%",
                    endTime: "15%",
                    actions: "6%",
                  }}
                  contentData={[
                    {
                      name: <TextField marginBottom0 required />,
                      status: (
                        <Select<string>
                          fullWidth
                          marginBottom0
                          dataOptions={[
                            {
                              value: "",
                              label: "",
                            },
                            {
                              value: "open",
                              label: "Open",
                            },
                            {
                              value: "closed",
                              label: "Closed",
                            },
                          ]}
                        />
                      ),
                      startDate: (
                        <Layout className="flex flex-direction-column">
                          <DateField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <DateField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <DateField usePortal marginBottom0 />
                        </Layout>
                      ),
                      startTime: (
                        <Layout className="flex flex-direction-column">
                          <TimeField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <TimeField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <TimeField usePortal marginBottom0 />
                        </Layout>
                      ),
                      endDate: (
                        <Layout className="flex flex-direction-column">
                          <DateField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <DateField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <DateField usePortal marginBottom0 />
                        </Layout>
                      ),
                      endTime: (
                        <Layout className="flex flex-direction-column">
                          <TimeField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <TimeField usePortal marginBottom0 />
                          <Layout className="marginTopHalf" />
                          <TimeField usePortal marginBottom0 />
                        </Layout>
                      ),
                      actions: (
                        <Layout className="full flex flex-direction-row centerContent">
                          <IconButton icon="plus-sign" />
                          <IconButton icon="trash" />
                        </Layout>
                      ),
                    },
                    {
                      name: <TextField marginBottom0 required />,
                      status: (
                        <Select<string>
                          fullWidth
                          marginBottom0
                          dataOptions={[
                            {
                              value: "",
                              label: "",
                            },
                            {
                              value: "open",
                              label: "Open",
                            },
                            {
                              value: "closed",
                              label: "Closed",
                            },
                          ]}
                        />
                      ),
                      startDate: <DateField usePortal marginBottom0 />,
                      startTime: <TimeField usePortal marginBottom0 />,
                      endDate: <DateField usePortal marginBottom0 />,
                      endTime: <TimeField usePortal marginBottom0 />,
                      actions: (
                        <Layout className="full flex flex-direction-row centerContent">
                          <IconButton icon="plus-sign" />
                          <IconButton icon="trash" />
                        </Layout>
                      ),
                    },
                    {
                      name: <TextField<string> marginBottom0 required />,
                      status: (
                        <Select<string>
                          fullWidth
                          marginBottom0
                          dataOptions={[
                            {
                              value: "",
                              label: "",
                            },
                            {
                              value: "open",
                              label: "Open",
                            },
                            {
                              value: "closed",
                              label: "Closed",
                            },
                          ]}
                        />
                      ),
                      startDate: <DateField usePortal marginBottom0 />,
                      endDate: <DateField usePortal marginBottom0 />,
                      actions: (
                        <Layout className="full flex flex-direction-row centerContent">
                          <IconButton
                            icon="plus-sign"
                            style={{
                              color: "#bbb",
                            }}
                          />
                          <IconButton icon="trash" />
                        </Layout>
                      ),
                    },
                    {
                      name: <Button marginBottom0>Add row</Button>,
                    },
                  ]}
                />
              </Accordion> */}
            </AccordionSet>
          </form>
        );
      }}
    />
  );
};

export default CreateCalendarForm;
