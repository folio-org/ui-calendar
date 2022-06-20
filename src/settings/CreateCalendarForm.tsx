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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormApi, SubmissionErrors } from "final-form";
import memoizee from "memoizee";
import React, { FunctionComponent, useContext, useMemo, useRef } from "react";
import { Field, Form } from "react-final-form";
import { useIntl } from "react-intl";
import { ServicePoint } from "../types/types";
import validate, { FormValues } from "./fields/formValidation";
import HoursOfOperationField from "./fields/HoursOfOperationField";
import { HoursOfOperationRowState } from "./fields/HoursOfOperationFieldTypes";
import RowType from "./fields/RowType";
import ServicePointAssignmentField from "./fields/ServicePointAssignmentField";
import { CALENDARS } from "./MockConstants";

dayjs.extend(customParseFormat);

const TextFieldComponent = TextField<string, TextFieldRenderProps<string>>;
const DateFieldComponent = DateField<DateFieldRenderProps>;

export const FORM_ID = "ui-calendar-create-calendar-form";

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
