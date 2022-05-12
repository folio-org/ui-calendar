import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Icon,
  List,
  MenuSection,
  MultiColumnList,
  Pane,
  Row,
} from "@folio/stripes-components";
import React from "react";

export default function InfoPane(props) {
  if (!props.isDisplayed) {
    return null;
  }

  const calendar = props.info.calendar;

  return (
    <Pane
      paneTitle={calendar.name}
      defaultWidth="fill"
      centerContent={true}
      onClose={props.onClose}
      dismissible
      actionMenu={(onToggle) => (
        <>
          <MenuSection label="Actions">
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
              <Icon size="small" icon="edit">
                Edit
              </Icon>
            </Button>
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
              <Icon size="small" icon="duplicate">
                Duplicate
              </Icon>
            </Button>
            <Button buttonStyle="dropdownItem" onClick={onToggle}>
              <Icon size="small" icon="trash">
                Delete
              </Icon>
            </Button>
          </MenuSection>
        </>
      )}
    >
      <Headline size="x-large" margin="xx-small">
        {calendar.name}
      </Headline>
      From {calendar.startDate} to {calendar.endDate}
      <AccordionSet>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton />
          </Col>
        </Row>
        <Accordion label="Assignments">
          <List
            items={calendar.servicePoints}
            isEmptyMessage={
              <div style={{ fontStyle: "italic", color: "grey" }}>
                This calendar is not assigned to any service points.
              </div>
            }
          />
        </Accordion>
        <Accordion label="Hours of operation">
          <MultiColumnList
            interactive={false}
            onHeaderClick={() => ({})}
            columnMapping={{
              day: "Status",
              startTime: "Open",
              endTime: "Close",
            }}
            contentData={[]}
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
}
