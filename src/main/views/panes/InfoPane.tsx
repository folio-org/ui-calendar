import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Icon,
  KeyValue,
  List,
  Loading,
  MenuSection,
  Modal,
  ModalFooter,
  MultiColumnList,
  Pane,
  Row,
} from "@folio/stripes-components";
import { IfPermission, useStripes } from "@folio/stripes-core";
import classNames from "classnames";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { FunctionComponent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DataRepository from "../../data/DataRepository";
import permissions from "../../types/permissions";
import { Calendar, CalendarException } from "../../types/types";
import { isOpen247 } from "../../utils/CalendarUtils";
import { getLocalizedDate } from "../../utils/DateUtils";
import ifPermissionOr from "../../utils/ifPermissionOr";
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  generateDisplayRows,
  generateExceptionalOpeningRows,
  get247Rows,
  splitOpeningsIntoDays,
} from "../../utils/InfoPaneUtils";
import { useLocaleWeekdays } from "../../utils/WeekdayUtils";
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
  const intl = useIntl();
  const stripes = useStripes();
  const localeWeekdays = useLocaleWeekdays(intl);
  const calendar = props.calendar;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalSubmitting, setDeleteModalSubmitting] =
    useState<boolean>(false);

  if (calendar === undefined || calendar === null) {
    return null;
  }

  const hours = splitOpeningsIntoDays(calendar.normalHours);

  let dataRows;
  if (isOpen247(calendar.normalHours)) {
    dataRows = get247Rows(intl, localeWeekdays);
  } else {
    dataRows = generateDisplayRows(intl, localeWeekdays, hours);
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
        actionMenu={({ onToggle }) =>
          ifPermissionOr(
            stripes,
            [permissions.UPDATE, permissions.CREATE, permissions.DELETE],
            <MenuSection
              label={
                <FormattedMessage id="ui-calendar.infoPane.actions.label" />
              }
            >
              <IfPermission perm={permissions.UPDATE}>
                <Button
                  buttonStyle="dropdownItem"
                  onClick={onToggle}
                  to={`${props.editBasePath}/${calendar.id}`}
                >
                  <Icon size="small" icon="edit">
                    <FormattedMessage id="stripes-core.button.edit" />
                  </Icon>
                </Button>
              </IfPermission>
              <IfPermission perm={permissions.CREATE}>
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
                    <FormattedMessage id="stripes-core.button.duplicate" />
                  </Icon>
                </Button>
              </IfPermission>
              <IfPermission perm={permissions.DELETE}>
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
                    <FormattedMessage id="stripes-core.button.delete" />
                  </Icon>
                </Button>
              </IfPermission>
            </MenuSection>
          )
        }
      >
        <Headline size="x-large" margin="xx-small">
          {calendar.name}
        </Headline>

        <Row>
          <Col xs={12} sm>
            <KeyValue
              label={<FormattedMessage id="ui-calendar.infoPane.startDate" />}
            >
              {getLocalizedDate(intl, calendar.startDate)}
            </KeyValue>
          </Col>
          <Col xs={12} sm>
            <KeyValue
              label={<FormattedMessage id="ui-calendar.infoPane.endDate" />}
            >
              {getLocalizedDate(intl, calendar.endDate)}
            </KeyValue>
          </Col>
        </Row>

        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.assignments" />
            }
          >
            <List
              items={props.dataRepository.getServicePointNamesFromIds(
                calendar.assignments
              )}
              listStyle="bullets"
              isEmptyMessage={
                <div className={css.closed}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.assignments.empty" />
                </div>
              }
            />
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.hours" />
            }
          >
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
                day: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.hours.day" />
                ),
                startTime: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.hours.open" />
                ),
                endTime: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.hours.close" />
                ),
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
              <FormattedMessage id="ui-calendar.infoPane.nextDayHelpText" />
            </p>
            <p
              className={
                !isOpen247(calendar.normalHours) &&
                containsFullOvernightSpans(hours)
                  ? ""
                  : css.hidden
              }
            >
              <FormattedMessage id="ui-calendar.infoPane.overnightHelpText" />
            </p>
            <p className={isOpen247(calendar.normalHours) ? "" : css.hidden}>
              <FormattedMessage id="ui-calendar.infoPane.247HelpText" />
            </p>
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.openings" />
            }
          >
            <MultiColumnList
              interactive={false}
              onHeaderClick={() => ({})}
              columnMapping={{
                name: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.name" />
                ),
                start: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.start" />
                ),
                end: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.end" />
                ),
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
              contentData={generateExceptionalOpeningRows(
                intl,
                exceptions.openings
              )}
              isEmptyMessage={
                <div className={css.closed}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.openings.empty" />
                </div>
              }
            />
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.closures" />
            }
          >
            <MultiColumnList
              interactive={false}
              onHeaderClick={() => ({})}
              columnMapping={{
                name: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.name" />
                ),
                startDate: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.start" />
                ),
                endDate: (
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.end" />
                ),
              }}
              columnWidths={{
                name: "40%",
                startDate: "30%",
                endDate: "30%",
              }}
              contentData={exceptions.closures.map((exception) => ({
                name: exception.name,
                startDate: getLocalizedDate(intl, exception.startDate),
                endDate: getLocalizedDate(intl, exception.endDate),
              }))}
              isEmptyMessage={
                <div className={css.closed}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.closures.empty" />
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
        label={
          <FormattedMessage id="ui-calendar.infoPane.deletionModal.label" />
        }
        aria-label={intl.formatMessage({
          id: "ui-calendar.infoPane.deletionModal.label",
        })}
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
              {deleteModalSubmitting ? (
                <Loading />
              ) : (
                <FormattedMessage id="stripes-core.button.delete" />
              )}
            </Button>
            <Button onClick={() => setShowDeleteModal(false)}>
              <FormattedMessage id="stripes-core.button.cancel" />
            </Button>
          </ModalFooter>
        }
      >
        <FormattedMessage
          id="ui-calendar.infoPane.deletionModal.contents"
          values={{ name: calendar.name }}
        />
      </Modal>
    </>
  );
};

export default InfoPane;
