import {
  Accordion,
  AccordionSet,
  Badge,
  Button,
  List,
  Loading,
  Modal,
  ModalFooter,
  Select,
} from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Field, Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import DataRepository from '../data/DataRepository';
import { Calendar } from '../types/types';
import { dateFromYYYYMMDD } from '../utils/DateUtils';
import css from './PurgeModal.css';

export enum AgeCriteria {
  MONTHS_3 = 'MONTHS_3',
  MONTHS_6 = 'MONTHS_6',
  YEAR_1 = 'YEAR_1',
  YEARS_2 = 'YEARS_2',
}

const AgeCriteriaLabels: Record<AgeCriteria, string> = {
  [AgeCriteria.MONTHS_3]: 'ui-calendar.purgeModal.criteria.age.months3',
  [AgeCriteria.MONTHS_6]: 'ui-calendar.purgeModal.criteria.age.months6',
  [AgeCriteria.YEAR_1]: 'ui-calendar.purgeModal.criteria.age.year1',
  [AgeCriteria.YEARS_2]: 'ui-calendar.purgeModal.criteria.age.years2',
};

const AgeCriteriaMonths: Record<AgeCriteria, number> = {
  [AgeCriteria.MONTHS_3]: 3,
  [AgeCriteria.MONTHS_6]: 6,
  [AgeCriteria.YEAR_1]: 12,
  [AgeCriteria.YEARS_2]: 24,
};

export enum AssignmentCriteria {
  NONE = 'NONE',
  ANY = 'ANY',
}

const AssignmentCriteriaLabels: Record<AssignmentCriteria, string> = {
  [AssignmentCriteria.NONE]: 'ui-calendar.purgeModal.criteria.assignment.none',
  [AssignmentCriteria.ANY]: 'ui-calendar.purgeModal.criteria.assignment.any',
};

export interface FormValues {
  ageCriteria: AgeCriteria | undefined;
  assignmentCriteria: AssignmentCriteria | undefined;
}

export const FORM_ID = 'ui-calendar-purge-old-calendar-form';

export const getCalendarsToPurge = (
  calendars: Calendar[],
  ageCriteria: AgeCriteria | undefined = undefined,
  assignmentCriteria: AssignmentCriteria | undefined = undefined
) => {
  if (ageCriteria === undefined || assignmentCriteria === undefined) {
    return [];
  }

  const endBefore = new Date().setMonth(
    new Date().getMonth() - AgeCriteriaMonths[ageCriteria]
  );

  return calendars
    .filter((calendar) => {
      return (
        assignmentCriteria === AssignmentCriteria.ANY ||
        calendar.assignments.length === 0
      );
    })
    .filter(
      (calendar) => dateFromYYYYMMDD(calendar.endDate).getTime() < endBefore
    );
};

export interface PurgeModalProps {
  dataRepository: DataRepository;
  open: boolean;
  onClose: () => void;
}

export const PurgeModal: FunctionComponent<PurgeModalProps> = (
  props: PurgeModalProps
) => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // reset submitting on mount/unmount
  useEffect(() => setIsSubmitting(false), []);

  const callout = useContext(CalloutContext);

  return (
    <Modal
      dismissible
      open={props.open}
      onClose={props.onClose}
      label={<FormattedMessage id="ui-calendar.purgeModal.label" />}
      aria-label={intl.formatMessage({ id: 'ui-calendar.purgeModal.label' })}
      size="small"
      footer={
        <ModalFooter>
          <Button
            disabled={isSubmitting}
            buttonStyle="danger"
            form={FORM_ID}
            type="submit"
          >
            {isSubmitting ? (
              <Loading />
            ) : (
              <FormattedMessage id="stripes-core.button.delete" />
            )}
          </Button>
          <Button onClick={props.onClose}>
            <FormattedMessage id="stripes-core.button.cancel" />
          </Button>
        </ModalFooter>
      }
    >
      <Form<FormValues>
        initialValues={{
          ageCriteria: undefined,
          assignmentCriteria: undefined,
        }}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          const toPurge = getCalendarsToPurge(
            props.dataRepository.getCalendars(),
            values.ageCriteria,
            values.assignmentCriteria
          );
          if (toPurge.length === 0) {
            props.onClose();
            setIsSubmitting(false);
            return;
          }

          try {
            await props.dataRepository.deleteCalendars(toPurge);
            props.onClose();
          } catch (e) {
            callout.sendCallout({
              type: 'error',
              message: await (e as HTTPError).response.text(),
            });
          } finally {
            setIsSubmitting(false);
          }
        }}
        render={(params) => {
          const { handleSubmit, values } = params;

          const toPurge = getCalendarsToPurge(
            props.dataRepository.getCalendars(),
            values.ageCriteria,
            values.assignmentCriteria
          );

          const submitter = (e: FormEvent) => {
            handleSubmit(e);
          };

          return (
            <form id={FORM_ID} onSubmit={submitter}>
              <Field
                name="ageCriteria"
                component={Select<AgeCriteria | undefined>}
                required
                label={
                  <FormattedMessage id="ui-calendar.purgeModal.criteria.age.prompt" />
                }
                fullWidth
                dataOptions={[
                  { value: undefined, label: '' },
                  ...Object.entries(AgeCriteriaLabels).map(
                    ([value, label]) => ({
                      value: value as AgeCriteria,
                      label: intl.formatMessage({ id: label }),
                    })
                  ),
                ]}
              />
              <Field
                name="assignmentCriteria"
                component={Select<AssignmentCriteria | undefined>}
                required
                label={
                  <FormattedMessage id="ui-calendar.purgeModal.criteria.assignment.prompt" />
                }
                fullWidth
                dataOptions={[
                  { value: undefined, label: '' },
                  ...Object.entries(AssignmentCriteriaLabels).map(
                    ([value, label]) => ({
                      value: value as AssignmentCriteria,
                      label: intl.formatMessage({ id: label }),
                    })
                  ),
                ]}
              />
              <AccordionSet>
                <Accordion
                  label={
                    <FormattedMessage id="ui-calendar.purgeModal.deletionList.label" />
                  }
                  closedByDefault
                  displayWhenClosed={
                    <Badge color="default">{toPurge.length}</Badge>
                  }
                  displayWhenOpen={
                    <Badge color="default">{toPurge.length}</Badge>
                  }
                >
                  <List
                    items={toPurge.map((c) => c.name)}
                    listStyle="bullets"
                    isEmptyMessage={
                      <div className={css.noneToDelete}>
                        <FormattedMessage id="ui-calendar.purgeModal.deletionList.empty" />
                      </div>
                    }
                  />
                </Accordion>
              </AccordionSet>
            </form>
          );
        }}
      />
    </Modal>
  );
};

export default PurgeModal;
