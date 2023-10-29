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
  MetaSection,
  Modal,
  ModalFooter,
  MultiColumnList,
  Pane,
  Row,
} from '@folio/stripes/components';
import { IfPermission, useOkapiKy, useStripes } from '@folio/stripes/core';
import classNames from 'classnames';
import { HTTPError } from 'ky';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import DataRepository from '../../data/DataRepository';
import permissions from '../../types/permissions';
import { CalendarDTO, CalendarException, User } from '../../types/types';
import { isOpen247 } from '../../utils/CalendarUtils';
import { getLocalizedDate } from '../../utils/DateUtils';
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  generateDisplayRows,
  generateExceptionalOpeningRows,
  get247Rows,
  splitOpeningsIntoDays,
} from '../../utils/InfoPaneUtils';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import ifPermissionOr from '../../utils/ifPermissionOr';
import css from './InfoPane.css';

export interface InfoPaneProps {
  creationBasePath: string;
  editBasePath: string;
  calendar?: CalendarDTO | null;
  onClose: () => void;
  dataRepository: DataRepository;
}

export const InfoPane: FunctionComponent<InfoPaneProps> = (
  props: InfoPaneProps,
) => {
  const intl = useIntl();
  const stripes = useStripes();
  const localeWeekdays = useLocaleWeekdays(intl);
  const calendar = props.calendar;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalSubmitting, setDeleteModalSubmitting] =
    useState<boolean>(false);

  const ky = useOkapiKy();

  const metadata = {
    createdBy: useQuery<User>(
      ['ui-calendar', 'users', calendar?.metadata?.createdByUserId],
      () => ky.get(`users/${calendar?.metadata?.createdByUserId}`).json<User>(),
    ).data,
    createdAt: calendar?.metadata?.createdDate,
    updatedBy: useQuery<User>(
      ['ui-calendar', 'users', calendar?.metadata?.updatedByUserId],
      () => ky.get(`users/${calendar?.metadata?.updatedByUserId}`).json<User>(),
    ).data,
    updatedAt: calendar?.metadata?.updatedDate,
  };

  const exceptions = useMemo(() => {
    const ex: {
      openings: CalendarException[];
      closures: CalendarException[];
    } = {
      openings: [],
      closures: [],
    };

    calendar?.exceptions.forEach((exception) => {
      if (exception.openings.length === 0) {
        ex.closures.push(exception);
      } else {
        exception.openings.sort((a, b) => {
          return Math.sign(
            new Date(`${a.startDate} ${a.endDate}`).getTime() -
              new Date(`${b.startDate} ${b.endDate}`).getTime(),
          );
        });
        ex.openings.push(exception);
      }
    });

    return {
      openings: generateExceptionalOpeningRows(intl, ex.openings),
      closures: ex.closures.map((exception) => ({
        name: exception.name,
        startDate: getLocalizedDate(intl, exception.startDate),
        endDate: getLocalizedDate(intl, exception.endDate),
      })),
    };
  }, [calendar, intl]);

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

  return (
    <>
      <Pane
        paneTitle={calendar.name}
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        actionMenu={({ onToggle }) => {
          return ifPermissionOr(
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
                      source: calendar.id,
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
            </MenuSection>,
          );
        }}
      >
        <Headline size="x-large" margin="xx-small">
          {calendar.name}
        </Headline>

        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton />
            </Col>
          </Row>

          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.infoLabel" />
            }
          >
            <MetaSection
              createdBy={metadata.createdBy}
              createdDate={metadata.createdAt}
              lastUpdatedBy={metadata.updatedBy}
              lastUpdatedDate={metadata.updatedAt}
              showUserLink={stripes.hasPerm('ui-users.view')}
            />

            <Row>
              <Col xs={12} sm>
                <KeyValue
                  label={
                    <FormattedMessage id="ui-calendar.infoPane.startDate" />
                  }
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
          </Accordion>

          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.assignments" />
            }
          >
            <List
              items={props.dataRepository.getServicePointNamesFromIds(
                calendar.assignments,
              )}
              listStyle="bullets"
              isEmptyMessage={
                <span className={css.noValue}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.assignments.empty" />
                </span>
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
              getCellClass={(defaultClass, _rowData, column) => {
                return classNames(defaultClass, {
                  [css.hoursCell]: column !== 'day',
                  [css.dayCell]: column === 'day',
                });
              }}
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
                day: 200,
                startTime: { min: 100, max: 100 },
                endTime: { min: 100, max: 100 },
              }}
              contentData={dataRows}
            />
            <p
              className={
                !isOpen247(calendar.normalHours) &&
                containsNextDayOvernight(hours)
                  ? ''
                  : css.hidden
              }
            >
              <FormattedMessage id="ui-calendar.infoPane.nextDayHelpText" />
            </p>
            <p
              className={
                !isOpen247(calendar.normalHours) &&
                containsFullOvernightSpans(hours)
                  ? ''
                  : css.hidden
              }
            >
              <FormattedMessage id="ui-calendar.infoPane.overnightHelpText" />
            </p>
            <p className={isOpen247(calendar.normalHours) ? '' : css.hidden}>
              <FormattedMessage id="ui-calendar.infoPane.247HelpText" />
            </p>
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.openings" />
            }
          >
            <MultiColumnList
              key={`${calendar.id}-ex-openings`}
              interactive={false}
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
                name: 200,
                start: { min: 100, max: 100 },
                end: { min: 100, max: 100 },
              }}
              getCellClass={(defaultClass, _rowData, column) => {
                return classNames(defaultClass, {
                  [css.hoursCell]: column !== 'name',
                  [css.exceptionCell]: column !== 'name',
                  [css.dayCell]: column === 'name',
                });
              }}
              contentData={exceptions.openings}
              isEmptyMessage={
                <div className={css.noValue}>
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
              key={`${calendar.id}-ex-closures`}
              interactive={false}
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
                name: 200,
                startDate: { min: 100, max: 100 },
                endDate: { min: 100, max: 100 },
              }}
              contentData={exceptions.closures}
              isEmptyMessage={
                <div className={css.noValue}>
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
          id: 'ui-calendar.infoPane.deletionModal.label',
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
                  alert(await (e as HTTPError).response.text());
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
