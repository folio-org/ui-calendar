import {
  Accordion,
  AccordionSet,
  Col,
  Datepicker as DateField,
  ExpandAllButton,
  Row,
  TextField,
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
            <Accordion label="Gene12ral information">blank</Accordion>
            <Accordion label="Gene23al information">blank</Accordion>
            <Accordion label="Gene34al information">blank</Accordion>
          </AccordionSet>
        )}
      </Form>
    </form>
  );
}
