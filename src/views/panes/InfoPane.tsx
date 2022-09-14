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
  Row
} from '@folio/stripes/components';
import { IfPermission, useStripes } from '@folio/stripes/core';
import classNames from 'classnames';
import { HTTPError } from 'ky';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState
} from 'react';
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl
} from 'react-intl';
import DataRepository from '../../data/DataRepository';
import permissions from '../../types/permissions';
import { CalendarDTO, CalendarException, User } from '../../types/types';
import { isOpen247 } from '../../utils/CalendarUtils';
import { getLocalizedDate } from '../../utils/DateUtils';
import ifPermissionOr from '../../utils/ifPermissionOr';
import {
  containsFullOvernightSpans,
  containsNextDayOvernight,
  generateDisplayRows,
  generateExceptionalOpeningRows,
  get247Rows,
  splitOpeningsIntoDays
} from '../../utils/InfoPaneUtils';
import { useLocaleWeekdays } from '../../utils/WeekdayUtils';
import css from './InfoPane.css';

export interface InfoPaneProps {
  creationBasePath: string;
  editBasePath: string;
  calendar?: CalendarDTO | null;
  onClose: () => void;
  dataRepository: DataRepository;
}

// from ui-users components/util/util.js
function getUserDisplayName(user: User): string {
  let fullName = user?.personal?.lastName || '';
  let givenName =
    user?.personal?.preferredFirstName || user?.personal?.firstName || '';

  const middleName = user?.personal?.middleName || '';

  if (middleName) {
    givenName += `${givenName ? ' ' : ''}${middleName}`;
  }

  if (givenName) {
    fullName += `${fullName ? ', ' : ''}${givenName}`;
  }

  return fullName;
}

export const InfoPane: FunctionComponent<InfoPaneProps> = (
  props: InfoPaneProps
) => {
  const intl = useIntl();
  const stripes = useStripes();
  const localeWeekdays = useLocaleWeekdays(intl);
  const calendar = props.calendar;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalSubmitting, setDeleteModalSubmitting] =
    useState<boolean>(false);

  const [metadata, setMetadata] = useState<{
    createdBy: ReactNode;
    createdAt: ReactNode;
    updatedBy: ReactNode;
    updatedAt: ReactNode;
  }>({
    createdBy: <></>,
    createdAt: <></>,
    updatedBy: <></>,
    updatedAt: <></>
  });

  const { dataRepository } = props;
  useEffect(() => {
    const newMetadata: typeof metadata = {
      createdBy: (
        <div className={css.noValue}>
          <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.unknownUser" />
        </div>
      ),
      createdAt: (
        <div className={css.noValue}>
          <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.unknownDate" />
        </div>
      ),
      updatedBy: (
        <div className={css.noValue}>
          <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.unknownUser" />
        </div>
      ),
      updatedAt: (
        <div className={css.noValue}>
          <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.unknownDate" />
        </div>
      )
    };

    const abortController = new AbortController();

    if (calendar?.metadata?.createdByUserId) {
      // better than no info, while the API fetches
      newMetadata.createdBy = calendar.metadata.createdByUserId;

      dataRepository
        .getUser(calendar.metadata.createdByUserId, abortController.signal)
        .then(
          (user) => !abortController.signal.aborted &&
            setMetadata((current) => ({
              ...current,
              createdBy: getUserDisplayName(user)
            }))
        );
    }
    if (calendar?.metadata?.updatedByUserId) {
      // better than no info, while the API fetches
      newMetadata.updatedBy = calendar.metadata.updatedByUserId;

      dataRepository
        .getUser(calendar.metadata.updatedByUserId, abortController.signal)
        .then(
          (user) => !abortController.signal.aborted &&
            setMetadata((current) => ({
              ...current,
              updatedBy: getUserDisplayName(user)
            }))
        );
    }

    if (calendar?.metadata?.createdDate) {
      newMetadata.createdAt = (
        <FormattedMessage
          id="ui-calendar.infoPane.accordion.metadata.dateTime"
          values={{
            date: (
              <FormattedDate value={new Date(calendar.metadata.createdDate)} />
            ),
            time: (
              <FormattedTime value={new Date(calendar.metadata.createdDate)} />
            )
          }}
        />
      );
    }
    if (calendar?.metadata?.updatedDate) {
      newMetadata.updatedAt = (
        <FormattedMessage
          id="ui-calendar.infoPane.accordion.metadata.dateTime"
          values={{
            date: (
              <FormattedDate value={new Date(calendar.metadata.updatedDate)} />
            ),
            time: (
              <FormattedTime value={new Date(calendar.metadata.updatedDate)} />
            )
          }}
        />
      );
    }

    setMetadata(newMetadata);

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar]);

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
    closures: []
  };

  calendar.exceptions.forEach((exception) => {
    if (exception.openings.length === 0) {
      exceptions.closures.push(exception);
    } else {
      exception.openings.sort((a, b) => {
        return Math.sign(
          new Date(`${a.startDate} ${a.endDate}`).getTime() -
            new Date(`${b.startDate} ${b.endDate}`).getTime()
        );
      });
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
                      source: calendar.id as string
                    }).toString()
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
          );
        }}
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
                <div className={css.noValue}>
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
              getCellClass={(defaultClass, _rowData, column) => {
                return classNames(defaultClass, {
                  [css.hoursCell]: column !== 'day',
                  [css.dayCell]: column === 'day'
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
                )
              }}
              columnWidths={{
                day: '40%',
                startTime: '30%',
                endTime: '30%'
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
                )
              }}
              columnWidths={{
                name: '40%',
                start: '30%',
                end: '30%'
              }}
              getCellClass={(defaultClass, _rowData, column) => {
                return classNames(defaultClass, {
                  [css.hoursCell]: column !== 'name',
                  [css.exceptionCell]: column !== 'name',
                  [css.dayCell]: column === 'name'
                });
              }}
              contentData={generateExceptionalOpeningRows(
                intl,
                exceptions.openings
              )}
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
                )
              }}
              columnWidths={{
                name: '40%',
                startDate: '30%',
                endDate: '30%'
              }}
              contentData={exceptions.closures.map((exception) => ({
                name: exception.name,
                startDate: getLocalizedDate(intl, exception.startDate),
                endDate: getLocalizedDate(intl, exception.endDate)
              }))}
              isEmptyMessage={
                <div className={css.noValue}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.exceptions.closures.empty" />
                </div>
              }
            />
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-calendar.infoPane.accordion.metadata" />
            }
          >
            <KeyValue
              label={
                <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.createdBy" />
              }
            >
              {metadata.createdBy}
            </KeyValue>
            <KeyValue
              label={
                <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.createdAt" />
              }
            >
              {metadata.createdAt}
            </KeyValue>
            <KeyValue
              label={
                <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.updatedBy" />
              }
            >
              {metadata.updatedBy}
            </KeyValue>
            <KeyValue
              label={
                <FormattedMessage id="ui-calendar.infoPane.accordion.metadata.updatedAt" />
              }
            >
              {metadata.updatedAt}
            </KeyValue>
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
          id: 'ui-calendar.infoPane.deletionModal.label'
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
