import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  IconButton,
  MultiColumnList,
  Row,
  Select,
  TextField,
  Timepicker as TimeField,
} from "@folio/stripes-components";
import { Field, Form } from "react-final-form";
import ServicePointAssignmentField from "./ServicePointAssignmentField";

export default function CreateCalendarForm() {
  const SERVICE_POINTS = [
    { label: "Service point 1" },
    { label: "Service point 3" },
    { label: "Service point 4" },
    { label: "Service point 5 (overnight)" },
  ];

  return (
    <form>
      <Form onSubmit={console.log}>
        {() => (
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
                    component={TextField}
                    autoFocus
                    required
                    name="name"
                    label="Calendar name"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <Field
                    component={DateField}
                    required
                    name="start-date"
                    label="Start date"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <Field
                    component={DateField}
                    required
                    name="end-date"
                    label="End date"
                  />
                </Col>
              </Row>
              <ServicePointAssignmentField servicePoints={SERVICE_POINTS} />
            </Accordion>
            <Accordion label="Hours of Operation">
              <MultiColumnList
                onHeaderClick={() => ({})}
                columnMapping={{
                  status: "Status",
                  startDay: "Start day",
                  startTime: "Start time",
                  endDay: "End day",
                  endTime: "End time",
                  actions: "Actions",
                }}
                contentData={[
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "open", label: "Open" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    ),
                    startDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    startTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    endDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    endTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    actions: <IconButton icon="trash" />,
                  },
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "open", label: "Open" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    ),
                    startDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    startTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    endDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    endTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    actions: <IconButton icon="trash" />,
                  },
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "open", label: "Open" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    ),
                    startDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    startTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    endDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    endTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    actions: <IconButton icon="trash" />,
                  },
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "open", label: "Open" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    ),
                    startDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    startTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    endDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    endTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    actions: <IconButton icon="trash" />,
                  },
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "open", label: "Open" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    ),
                    startDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    startTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    endDay: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[
                          { value: "", label: "" },
                          { value: "n", label: "Sunday" },
                          { value: "m", label: "Monday" },
                          { value: "t", label: "Tuesday" },
                          { value: "w", label: "Wednesday" },
                          { value: "r", label: "Thursday" },
                          { value: "f", label: "Friday" },
                          { value: "s", label: "Saturday" },
                        ]}
                      />
                    ),
                    endTime: (
                      <TimeField usePortal placement="bottom" marginBottom0 />
                    ),
                    actions: <IconButton icon="trash" />,
                  },
                ]}
              />
            </Accordion>
            <Accordion label="Exceptions">blank</Accordion>
          </AccordionSet>
        )}
      </Form>
    </form>
  );
}
