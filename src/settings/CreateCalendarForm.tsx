import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  getLocaleDateFormat,
  getLocalizedTimeFormatInfo,
  Headline,
  Icon,
  Row,
  TextField,
} from "@folio/stripes-components";
import { DatepickerFieldRenderProps as DateFieldRenderProps } from "@folio/stripes-components/types/lib/Datepicker/Datepicker";
import { TextFieldRenderProps } from "@folio/stripes-components/types/lib/TextField/TextField";
import { CalloutContext } from "@folio/stripes-core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormApi, FORM_ERROR, SubmissionErrors } from "final-form";
import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Field, Form } from "react-final-form";
import { useIntl } from "react-intl";
import {
  Calendar,
  ErrorCode,
  ErrorResponse,
  ServicePoint,
  Weekday,
} from "../types/types";
import DataRepository from "./DataRepository";
import ExceptionField from "./fields/ExceptionField";
import { ExceptionRowState } from "./fields/ExceptionFieldTypes";
import validate, { FormValues, InnerFieldRefs } from "./fields/formValidation";
import css from "./fields/HoursAndExceptionFields.css";
import HoursOfOperationField from "./fields/HoursOfOperationField";
import { HoursOfOperationRowState } from "./fields/HoursOfOperationFieldTypes";
import RowType from "./fields/RowType";
import ServicePointAssignmentField from "./fields/ServicePointAssignmentField";

dayjs.extend(customParseFormat);

const TextFieldComponent = TextField<string, TextFieldRenderProps<string>>;
const DateFieldComponent = DateField<DateFieldRenderProps>;

export const FORM_ID = "ui-calendar-create-calendar-form";

export interface CreateCalendarFormProps {
  closeParentLayer: () => void;
  submitAttempted: boolean;
  dataRepository: DataRepository;
  setIsSubmitting: (isSaving: boolean) => void;
  servicePoints: ServicePoint[];
}

export const CreateCalendarForm: FunctionComponent<CreateCalendarFormProps> = (
  props: CreateCalendarFormProps
) => {
  const calloutContext = useContext(CalloutContext);

  const onSubmit = async (
    values: FormValues,
    form: FormApi<FormValues>
  ): Promise<SubmissionErrors> => {
    if (form.getState().hasValidationErrors) {
      return undefined;
    }

    props.setIsSubmitting(true);

    const newCalendar: Calendar = {
      id: null,
      name: values.name,
      startDate: values["start-date"],
      endDate: values["end-date"],
      assignments: [],
      normalHours: [],
      exceptions: [],
    };

    values["service-points"].forEach((servicePoint) =>
      newCalendar.assignments.push(servicePoint.id)
    );

    values["hours-of-operation"].forEach((opening) => {
      if (opening.type === RowType.Closed) return;

      newCalendar.normalHours.push({
        startDay: opening.startDay as Weekday,
        startTime: opening.startTime as string,
        endDay: opening.endDay as Weekday,
        endTime: opening.endTime as string,
      });
    });

    values.exceptions.forEach((exception) => {
      if (exception.type === RowType.Closed) {
        newCalendar.exceptions.push({
          name: exception.name,
          startDate: exception.rows[0].startDate as string,
          endDate: exception.rows[0].endDate as string,
          openings: [],
        });
      } else {
        const minDate = dayjs
          .min(exception.rows.map(({ startDate }) => dayjs(startDate)))
          .format("YYYY-MM-DD");
        const maxDate = dayjs
          .max(exception.rows.map(({ endDate }) => dayjs(endDate)))
          .format("YYYY-MM-DD");

        newCalendar.exceptions.push({
          name: exception.name,
          startDate: minDate,
          endDate: maxDate,
          openings: exception.rows.map((row) => ({
            startDate: row.startDate as string,
            startTime: row.startTime as string,
            endDate: row.endDate as string,
            endTime: row.endTime as string,
          })),
        });
      }
    });

    try {
      await props.dataRepository.createCalendar(newCalendar);

      props.setIsSubmitting(false);
      props.closeParentLayer();

      return {};
    } catch (e: unknown) {
      const response = e as Response;
      const errors = (await response.json()) as ErrorResponse;

      const submissionErrors: Partial<
        Record<keyof FormValues | typeof FORM_ERROR, ReactNode>
      > = {};

      errors.errors.forEach((error) => {
        switch (error.code) {
          case ErrorCode.CALENDAR_DATE_OVERLAP:
            calloutContext.sendCallout({
              message: error.message,
              type: "error",
            });
            submissionErrors["service-points"] =
              "Service points " +
              error.data.conflictingServicePointIds
                .map(
                  (id) =>
                    props.servicePoints.filter((sp) => sp.id === id)?.[0]?.name
                )
                .filter((name) => name)
                .join(", ") +
              " have overlaps.  " +
              error.message;
            break;

          case ErrorCode.CALENDAR_NO_NAME:
          case ErrorCode.CALENDAR_INVALID_DATE_RANGE:
          case ErrorCode.CALENDAR_INVALID_NORMAL_OPENINGS:
          case ErrorCode.CALENDAR_INVALID_EXCEPTIONS:
          case ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_ORDER:
          case ErrorCode.CALENDAR_INVALID_EXCEPTION_DATE_BOUNDARY:
          case ErrorCode.CALENDAR_INVALID_EXCEPTION_NAME:
          case ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENINGS:
            // eslint-disable-next-line no-alert
            alert(error.message);
            // eslint-disable-next-line no-console
            console.error(
              "The following error should have been caught by form validation!",
              error
            );
            submissionErrors[FORM_ERROR] = (
              <>
                {error.message}
                <br />
                If you see this, please report this error.
              </>
            );
            break;
          case ErrorCode.INTERNAL_SERVER_ERROR:
          case ErrorCode.INVALID_REQUEST:
          case ErrorCode.INVALID_PARAMETER:
          case ErrorCode.CALENDAR_NOT_FOUND: // not applicable
          case ErrorCode.CALENDAR_INVALID_EXCEPTION_OPENING_BOUNDARY: // bounds are auto-generated
          default:
            // eslint-disable-next-line no-alert
            alert("An internal server error occurred: " + error.message);
            calloutContext.sendCallout({
              message: "Internal server error",
              type: "error",
            });
            submissionErrors[FORM_ERROR] = error.message;
        }
      });

      props.setIsSubmitting(false);
      return submissionErrors;
    }
  };

  // const processInitialValues = memoizee(
  //   (initialValues: Partial<FormValues>): Partial<FormValues> => ({
  //     ...initialValues,
  //     "hours-of-operation": CALENDARS[3].normalHours.map(
  //       (opening, i): HoursOfOperationRowState => ({
  //         type: RowType.Open,
  //         i: -1 - i, // ensure `i` is negative as not to conflict
  //         ...opening,
  //       })
  //     ),
  //     exceptions: CALENDARS[3].exceptions.map(
  //       (exception, i): ExceptionRowState => {
  //         const result: ExceptionRowState = {
  //           i: -1 - i, // ensure `i` is negative as not to conflict
  //           type:
  //             exception.openings.length === 0 ? RowType.Closed : RowType.Open,
  //           name: exception.name,
  //           lastRowI: 0,
  //           rows: [],
  //         };

  //         if (result.type === RowType.Open) {
  //           exception.openings.forEach((opening, j) =>
  //             result.rows.push({ i: -1 - j, ...opening })
  //           );
  //         } else {
  //           result.rows.push({
  //             i: -1,
  //             startDate: exception.startDate,
  //             startTime: undefined,
  //             endDate: exception.endDate,
  //             endTime: undefined,
  //           });
  //         }

  //         return result;
  //       }
  //     ),
  //   })
  // );

  const intl = useIntl();
  const localeDateFormat = getLocaleDateFormat({ intl });
  const localeTimeFormat = getLocalizedTimeFormatInfo(intl.locale).timeFormat;

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const innerFieldRefs = useRef<InnerFieldRefs>({
    hoursOfOperation: { startTime: {}, endTime: {} },
    exceptions: { startDate: {}, startTime: {}, endDate: {}, endTime: {} },
  });

  const validationFunction = useMemo(
    () =>
      validate.bind(
        this,
        localeDateFormat,
        localeTimeFormat,
        { startDateRef, endDateRef },
        innerFieldRefs.current
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

        // const initialValues = processInitialValues(_initialValues);

        let topErrorMessage = <></>;
        if (submitErrors?.[FORM_ERROR]) {
          topErrorMessage = (
            <Headline
              margin="none"
              className={css.conflictMessage}
              weight="medium"
              size="medium"
            >
              <Icon icon="exclamation-circle" status="error" />
              {submitErrors[FORM_ERROR]}
            </Headline>
          );
        }

        return (
          <form id={FORM_ID} onSubmit={handleSubmit}>
            {topErrorMessage}
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
                      autoFocus
                      required
                      name="name"
                      label="Calendar name"
                      error={
                        (!dirtyFieldsSinceLastSubmit?.name &&
                          submitErrors?.name) ||
                        ((props.submitAttempted || touched?.name) &&
                          active !== "name" &&
                          errors?.name)
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
                        ((props.submitAttempted || touched?.["start-date"]) &&
                          active !== "start-date" &&
                          errors?.["start-date"])
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      inputRef={endDateRef}
                      backendDateStandard="YYYY-MM-DD"
                      required
                      usePortal
                      name="end-date"
                      label="End date"
                      error={
                        (!dirtyFieldsSinceLastSubmit?.["end-date"] &&
                          submitErrors?.["end-date"]) ||
                        ((props.submitAttempted || touched?.["end-date"]) &&
                          active !== "end-date" &&
                          errors?.["end-date"])
                      }
                    />
                  </Col>
                </Row>
                <ServicePointAssignmentField
                  servicePoints={props.servicePoints}
                  error={
                    !dirtyFieldsSinceLastSubmit?.["service-points"] &&
                    submitErrors?.["service-points"]
                  }
                />
              </Accordion>
              <Accordion label="Hours of operation">
                <Field
                  name="hours-of-operation"
                  component={HoursOfOperationField}
                  timeFieldRefs={innerFieldRefs.current.hoursOfOperation}
                  error={errors?.["hours-of-operation"]}
                  // initialValue={[] as HoursOfOperationRowState[]}
                  localeTimeFormat={localeTimeFormat}
                  submitAttempted={props.submitAttempted}
                />
              </Accordion>
              <Accordion label="Exceptions">
                <Field
                  name="exceptions"
                  component={ExceptionField}
                  fieldRefs={innerFieldRefs.current.exceptions}
                  error={errors?.exceptions}
                  // initialValue={[] as ExceptionRowState[]}
                  localeTimeFormat={localeTimeFormat}
                  submitAttempted={props.submitAttempted}
                />
              </Accordion>
            </AccordionSet>
          </form>
        );
      }}
    />
  );
};

export default CreateCalendarForm;
