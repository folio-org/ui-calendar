import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Icon,
  List,
  Loading,
  MenuSection,
  Modal,
  ModalFooter,
  MultiColumnList,
  Pane,
  Row,
} from "@folio/stripes-components";
import classNames from "classnames";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { FunctionComponent, useState } from "react";
import { getLocalizedDate, isOpen247 } from "../data/CalendarUtils";
import DataRepository from "../data/DataRepository";
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  generateDisplayRows,
  generateExceptionalOpeningRows,
  get247Rows,
  openingSorter,
  splitOpeningsIntoDays,
} from "../data/InfoPaneUtils";
import { Calendar, CalendarException, Weekday } from "../types/types";
import css from "./InfoPane.css";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export interface InfoPaneProps {
  creationBasePath: string;
  editBasePath: string;
  calendar?: Calendar | null;
  onClose: () => void;
  dataRepository: DataRepository;
}

export const InfoPane: FunctionComponent<InfoPaneProps> = (props) => {
  const calendar = props.calendar;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalSubmitting, setDeleteModalSubmitting] =
    useState<boolean>(false);

  if (calendar === undefined || calendar === null) {
    return null;
  }

  const hours = splitOpeningsIntoDays(calendar.normalHours);

  (Object.keys(hours) as Weekday[]).forEach((day) => {
    hours[day].sort(openingSorter);
  });

  let dataRows;
  if (isOpen247(calendar.normalHours)) {
    dataRows = get247Rows();
  } else {
    dataRows = generateDisplayRows(hours);
  }

  const exceptions: {
    openings: CalendarException[];
    closures: CalendarException[];
  } = {
    openings: [],
    closures: [],
  };

  calendar.exceptions.forEach((exception) => {
    if (exception.openings.length === 0) {
      exceptions.closures.push(exception);
    } else {
      exception.openings.sort((a, b) =>
        Math.sign(
          dayjs(`${a.startDate} ${a.endDate}`).diff(
            dayjs(`${b.startDate} ${b.endDate}`),
            "m"
          )
        )
      );
      exceptions.openings.push(exception);
    }
  });

  return (
    <>
      <Pane
        paneTitle={calendar.name}
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        actionMenu={({ onToggle }) => (
          <>
            <MenuSection label="Actions">
              <Button
                buttonStyle="dropdownItem"
                onClick={onToggle}
                to={`${props.editBasePath}/${calendar.id}`}
              >
                <Icon size="small" icon="edit">
                  Edit
                </Icon>
              </Button>
              <Button
                buttonStyle="dropdownItem"
                onClick={onToggle}
                to={{
                  pathname: props.creationBasePath,
                  search: new URLSearchParams({
                    source: calendar.id as string,
                  }).toString(),
                }}
              >
                <Icon size="small" icon="duplicate">
                  Duplicate
                </Icon>
              </Button>
              <Button
                buttonStyle="dropdownItem"
                onClick={() => {
                  onToggle();
                  setShowDeleteModal(true);
                }}
              >
                <Icon
                  size="small"
                  icon="trash"
                  iconRootClass={css.deleteButton}
                >
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
        From {getLocalizedDate(calendar.startDate)} to{" "}
        {getLocalizedDate(calendar.endDate)}
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <Accordion label="Service point assignments">
            <List
              items={props.dataRepository.getServicePointNamesFromIds(
                calendar.assignments
              )}
              listStyle="bullets"
              isEmptyMessage={
                <div className={css.closed}>
                  This calendar is not assigned to any service points.
                </div>
              }
            />
          </Accordion>
          <Accordion label="Hours of operation">
            <MultiColumnList
              interactive={false}
              onHeaderClick={() => ({})}
              getCellClass={(defaultClass, _rowData, column) =>
                classNames(defaultClass, {
                  [css.hoursCell]: column !== "day",
                  [css.dayCell]: column === "day",
                })
              }
              columnMapping={{
                day: "Day",
                startTime: "Open",
                endTime: "Close",
              }}
              columnWidths={{
                day: "40%",
                startTime: "30%",
                endTime: "30%",
              }}
              contentData={dataRows}
            />
            <p
              className={
                !isOpen247(calendar.normalHours) &&
                containsNextDayOvernight(hours)
                  ? ""
                  : css.hidden
              }
            >
              *&nbsp;indicates next day
            </p>
            <p
              className={
                !isOpen247(calendar.normalHours) &&
                containsFullOvernightSpans(hours)
                  ? ""
                  : css.hidden
              }
            >
              &ndash;&nbsp;indicates that the service point was already open or
              does not close
            </p>
            <p className={isOpen247(calendar.normalHours) ? "" : css.hidden}>
              This service point is open 24/7 and does not close
            </p>
          </Accordion>
          <Accordion label="Exceptions &mdash; openings">
            <MultiColumnList
              interactive={false}
              onHeaderClick={() => ({})}
              columnMapping={{
                name: "Name",
                start: "Start",
                end: "End",
              }}
              columnWidths={{
                name: "40%",
                start: "30%",
                end: "30%",
              }}
              getCellClass={(defaultClass, _rowData, column) =>
                classNames(defaultClass, {
                  [css.hoursCell]: column !== "name",
                  [css.exceptionCell]: column !== "name",
                  [css.dayCell]: column === "name",
                })
              }
              contentData={generateExceptionalOpeningRows(exceptions.openings)}
              isEmptyMessage={
                <div className={css.closed}>
                  This calendar has no exceptional openings.
                </div>
              }
            />
          </Accordion>
          <Accordion label="Exceptions &mdash; closures">
            <MultiColumnList
              interactive={false}
              onHeaderClick={() => ({})}
              columnMapping={{
                name: "Name",
                startDate: "Start",
                endDate: "End",
              }}
              columnWidths={{
                name: "40%",
                startDate: "30%",
                endDate: "30%",
              }}
              contentData={exceptions.closures.map((exception) => ({
                name: exception.name,
                startDate: getLocalizedDate(exception.startDate),
                endDate: getLocalizedDate(exception.endDate),
              }))}
              isEmptyMessage={
                <div className={css.closed}>
                  This calendar has no exceptional closures.
                </div>
              }
            />
          </Accordion>
        </AccordionSet>
      </Pane>
      <Modal
        dismissible
        onClose={() => setShowDeleteModal(false)}
        open={showDeleteModal}
        label="Confirm deletion"
        aria-label="Confirm deletion"
        size="small"
        footer={
          <ModalFooter>
            <Button
              buttonStyle="danger"
              disabled={deleteModalSubmitting}
              onClick={async () => {
                setDeleteModalSubmitting(true);
                try {
                  await props.dataRepository.deleteCalendar(calendar);
                  props.onClose(); // will return to parent view automatically
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e);
                  // eslint-disable-next-line no-alert
                  alert((e as Response).text());
                } finally {
                  setShowDeleteModal(false);
                  setDeleteModalSubmitting(false);
                }
              }}
            >
              {deleteModalSubmitting ? <Loading /> : "Delete"}
            </Button>
            <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </ModalFooter>
        }
      >
        {`Are you sure you would like to delete the calendar "${calendar.name}"?`}
      </Modal>
    </>
  );
};

export default InfoPane;
