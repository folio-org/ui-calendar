import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  IconButton,
  Layout,
  MultiColumnList,
  Row,
  Select,
  TextField,
  Timepicker as TimeField,
} from "@folio/stripes-components";
import { Field, Form } from "react-final-form";
import ServicePointAssignmentField from "./ServicePointAssignmentField";

import "!style-loader!css-loader!./CreateCalendarForm.css";

function WeekdayPicker() {
  return (
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
  );
}

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
                    usePortal
                    name="start-date"
                    label="Start date"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <Field
                    component={DateField}
                    required
                    usePortal
                    name="end-date"
                    label="End date"
                  />
                </Col>
              </Row>
              <ServicePointAssignmentField servicePoints={SERVICE_POINTS} />
            </Accordion>
            <Accordion label="Hours of operation">
              <MultiColumnList
                interactive={false}
                onHeaderClick={() => ({})}
                columnMapping={{
                  status: "Status",
                  startDay: "Start day",
                  startTime: "Start time",
                  endDay: "End day",
                  endTime: "End time",
                  actions: "Actions",
                }}
                columnWidths={{
                  status: "14%",
                  startDay: "20%",
                  startTime: "20%",
                  endDay: "20%",
                  endTime: "20%",
                  actions: "6%",
                }}
                contentData={[
                  ...Array(3).fill({
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
                    startDay: <WeekdayPicker />,
                    startTime: <TimeField usePortal marginBottom0 />,
                    endDay: <WeekdayPicker />,
                    endTime: <TimeField usePortal marginBottom0 />,
                    actions: (
                      <Layout className="full flex flex-direction-row centerContent">
                        <IconButton icon="trash" />
                      </Layout>
                    ),
                  }),
                  {
                    status: (
                      <Select
                        portal={document.getElementById("OverlayContainer")}
                        fullWidth
                        marginBottom0
                        dataOptions={[{ value: "closed", label: "Closed" }]}
                      />
                    ),
                    startDay: <WeekdayPicker />,
                    endDay: <WeekdayPicker />,
                    actions: (
                      <Layout className="full flex flex-direction-row centerContent">
                        <IconButton icon="trash" />
                      </Layout>
                    ),
                  },
                  { status: <Button marginBottom0>Add row</Button> },
                ]}
              />
            </Accordion>
            <Accordion label="Exceptions">
              <MultiColumnList
                interactive={false}
                onHeaderClick={() => ({})}
                getCellClass={(defaultClass) =>
                  `${defaultClass} flex-align-items-start`
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
                    startDate: (
                      <Layout class="flex flex-direction-column">
                        <DateField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <DateField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <DateField usePortal marginBottom0 />
                      </Layout>
                    ),
                    startTime: (
                      <Layout class="flex flex-direction-column">
                        <TimeField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <TimeField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <TimeField usePortal marginBottom0 />
                      </Layout>
                    ),
                    endDate: (
                      <Layout class="flex flex-direction-column">
                        <DateField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <DateField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <DateField usePortal marginBottom0 />
                      </Layout>
                    ),
                    endTime: (
                      <Layout class="flex flex-direction-column">
                        <TimeField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
                        <TimeField usePortal marginBottom0 />
                        <Layout class="marginTopHalf" />
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
                    name: <TextField marginBottom0 required />,
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
                    startDate: <DateField usePortal marginBottom0 />,
                    endDate: <DateField usePortal marginBottom0 />,
                    actions: (
                      <Layout className="full flex flex-direction-row centerContent">
                        <IconButton
                          icon="plus-sign"
                          style={{ color: "#bbb" }}
                        />
                        <IconButton icon="trash" />
                      </Layout>
                    ),
                  },
                  { name: <Button marginBottom0>Add row</Button> },
                ]}
              />
            </Accordion>
          </AccordionSet>
        )}
      </Form>
    </form>
  );
}
