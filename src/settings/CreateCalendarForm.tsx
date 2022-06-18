import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  Row,
  TextField,
} from "@folio/stripes-components";
import { DatepickerFieldRenderProps as DateFieldRenderProps } from "@folio/stripes-components/types/lib/Datepicker/Datepicker";
import { TextFieldRenderProps } from "@folio/stripes-components/types/lib/TextField/TextField";
import { CalloutContext } from "@folio/stripes-core";
import { FormApi, SubmissionErrors, ValidationErrors } from "final-form";
import React, { FunctionComponent, useContext } from "react";
import { Field, Form } from "react-final-form";
import { CalendarOpening, ServicePoint } from "../types/types";
import HoursOfOperationField from "./HoursOfOperationField";
import { CALENDARS } from "./MockConstants";
import ServicePointAssignmentField from "./ServicePointAssignmentField";

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
  type FormValues = {
    name: string;
  };

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
        calloutContext.sendCallout({ message: "HEWWO", type: "error" });
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

  return (
    <Form<FormValues>
      // submitting={foo}
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: ValidationErrors = {};
        if (values.name?.trim() === "" || values.name === "foo") {
          errors.name = "AAAA";
        }
        return errors;
      }}
      validateOnBlur
      render={(foo) => {
        const {
          handleSubmit,
          errors,
          submitErrors,
          dirtyFieldsSinceLastSubmit,
          visited,
        } = foo;
        console.dir(foo);
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
                      autoFocus
                      required
                      name="name"
                      label="Calendar name"
                      error={
                        !dirtyFieldsSinceLastSubmit?.name &&
                        (submitErrors?.name || (visited?.name && errors?.name))
                      }
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      required
                      usePortal
                      name="start-date"
                      label="Start date"
                    />
                  </Col>
                  <Col xs={12} md={3}>
                    <Field
                      component={DateFieldComponent}
                      required
                      usePortal
                      name="end-date"
                      label="End date"
                    />
                  </Col>
                </Row>
                <ServicePointAssignmentField
                  servicePoints={props.servicePoints}
                />
              </Accordion>
              <Accordion label="Hours of operation">
                <Field
                  name="hoursOfOperation"
                  component={HoursOfOperationField}
                  initialValue={
                    CALENDARS[3].openings as Partial<CalendarOpening>[]
                  } // TODO: not this
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
