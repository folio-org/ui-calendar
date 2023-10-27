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
  Row
} from '@folio/stripes/components';
import { IfPermission, useStripes } from '@folio/stripes/core';
import classNames from 'classnames';
import { HTTPError } from 'ky';
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage, useIntl
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
import InfoPaneHours from '../../components/InfoPaneHours';

export interface InfoPaneProps {
  creationBasePath: string;
  editBasePath: string;
  calendar?: CalendarDTO | null;
  onClose: () => void;
  dataRepository: DataRepository;
}

export const InfoPane: FunctionComponent<InfoPaneProps> = (
  props: InfoPaneProps
) => {
  console.log('InfoPane.tsx: Component Render');
  const intl = useIntl();
  const stripes = useStripes();
  const localeWeekdays = useLocaleWeekdays(intl);
  const calendar = props.calendar;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteModalSubmitting, setDeleteModalSubmitting] =
    useState<boolean>(false);

  const [metadata, setMetadata] = useState<{
    createdBy?: User | ReactNode;
    createdAt?: string;
    updatedBy?: User | ReactNode;
    updatedAt?: string;
  }>({});

  const { dataRepository } = props;
  useEffect(() => {
    console.log('InfoPane.tsx: useEffect for fetching user data');
    const newMetadata: typeof metadata = {};

    const abortController = new AbortController();

    if (calendar?.metadata?.createdByUserId) {
      // better than no info, while the API fetches
      newMetadata.createdBy = calendar.metadata.createdByUserId;

      dataRepository
        .getUser(calendar.metadata.createdByUserId, abortController.signal)
        .then(
          (createdBy) => !abortController.signal.aborted &&
            setMetadata((current) => ({
              ...current,
              createdBy,
            }))
        )
        // eslint-disable-next-line no-console
        .catch((e) => console.error(e));
    }
    if (calendar?.metadata?.updatedByUserId) {
      // better than no info, while the API fetches
      console.log('InfoPane.tsx: useEffect for fetching user data, updatedByUserId');
      newMetadata.updatedBy = calendar.metadata.updatedByUserId;

      dataRepository
        .getUser(calendar.metadata.updatedByUserId, abortController.signal)
        .then(
          (updatedBy) => !abortController.signal.aborted &&
            setMetadata((current) => ({
              ...current,
              updatedBy,
            }))
        )
        // eslint-disable-next-line no-console
        .catch((e) => console.error(e));
    }

    if (calendar?.metadata?.createdDate) {
      newMetadata.createdAt = calendar.metadata.createdDate;
    }
    if (calendar?.metadata?.updatedDate) {
      newMetadata.updatedAt = calendar.metadata.updatedDate;
    }

    setMetadata(newMetadata);

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar]);

  const getCellClass = useCallback((defaultClass: string, _rowData: any, column: string) => {
    console.log('InfoPane.tsx: getCellClass, new');
    return classNames(defaultClass, {
      [css.hoursCell]: column !== 'name',
      [css.exceptionCell]: column !== 'name',
      [css.dayCell]: column === 'name',
    });
  }, []);

  const exceptions = useMemo(() => {
    console.log('InfoPane.tsx: useMemo for exceptions');
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
              new Date(`${b.startDate} ${b.endDate}`).getTime()
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
            </MenuSection>
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
                calendar.assignments
              )}
              listStyle="bullets"
              isEmptyMessage={
                <span className={css.noValue}>
                  <FormattedMessage id="ui-calendar.infoPane.accordion.assignments.empty" />
                </span>
              }
            />
          </Accordion>
          <InfoPaneHours calendar={calendar} />
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
              getCellClass={getCellClass}
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
