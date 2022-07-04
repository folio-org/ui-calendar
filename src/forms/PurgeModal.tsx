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
} from "@folio/stripes-components";
import { SelectFieldRenderProps } from "@folio/stripes-components/types/lib/Select/Select";
import dayjs from "dayjs";
import memoizee from "memoizee";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Field, Form } from "react-final-form";
import { FormattedMessage, useIntl } from "react-intl";
import DataRepository from "../data/DataRepository";
import { Calendar } from "../types/types";
import css from "./PurgeModal.css";

enum AgeCriteria {
  MONTHS_3 = "MONTHS_3",
  MONTHS_6 = "MONTHS_6",
  YEAR_1 = "YEAR_1",
  YEARS_2 = "YEARS_2",
}

const AgeCriteriaLabels: Record<AgeCriteria, ReactNode> = {
  [AgeCriteria.MONTHS_3]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.age.months3" />
  ),
  [AgeCriteria.MONTHS_6]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.age.months6" />
  ),
  [AgeCriteria.YEAR_1]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.age.year1" />
  ),
  [AgeCriteria.YEARS_2]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.age.years2" />
  ),
};

const AgeCriteriaMonths: Record<AgeCriteria, number> = {
  [AgeCriteria.MONTHS_3]: 3,
  [AgeCriteria.MONTHS_6]: 6,
  [AgeCriteria.YEAR_1]: 12,
  [AgeCriteria.YEARS_2]: 24,
};

enum AssignmentCriteria {
  NONE = "NONE",
  ANY = "ANY",
}

const AssignmentCriteriaLabels: Record<AssignmentCriteria, ReactNode> = {
  [AssignmentCriteria.NONE]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.assignment.none" />
  ),
  [AssignmentCriteria.ANY]: (
    <FormattedMessage id="ui-calendar.purgeModal.criteria.assignment.any" />
  ),
};

interface FormValues {
  ageCriteria: AgeCriteria;
  assignmentCriteria: AssignmentCriteria;
}

export const FORM_ID = "ui-calendar-purge-old-calendar-form";

const getCalendarsToPurge = memoizee(
  (
    calendars: Calendar[],
    ageCriteria: AgeCriteria = AgeCriteria.MONTHS_3,
    assignmentCriteria: AssignmentCriteria = AssignmentCriteria.NONE
  ) => {
    const endBefore = dayjs().subtract(
      AgeCriteriaMonths[ageCriteria],
      "months"
    );

    return calendars
      .filter(
        (calendar) =>
          assignmentCriteria === AssignmentCriteria.ANY ||
          calendar.assignments.length === 0
      )
      .filter((calendar) => dayjs(calendar.endDate).isBefore(endBefore));
  }
);

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

  return (
    <Modal
      dismissible
      open={props.open}
      onClose={props.onClose}
      label={<FormattedMessage id="ui-calendar.purgeModal.label" />}
      aria-label={intl.formatMessage({ id: "ui-calendar.purgeModal.label" })}
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
          ageCriteria: AgeCriteria.MONTHS_3,
          assignmentCriteria: AssignmentCriteria.NONE,
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
            return;
          }

          try {
            await props.dataRepository.deleteCalendars(toPurge);
            props.onClose();
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // eslint-disable-next-line no-alert
            alert((e as Response).text());
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

          return (
            <form id={FORM_ID} onSubmit={handleSubmit}>
              <Field
                name="ageCriteria"
                component={
                  Select<AgeCriteria, SelectFieldRenderProps<AgeCriteria>>
                }
                required
                label={
                  <FormattedMessage id="ui-calendar.purgeModal.criteria.age.prompt" />
                }
                fullWidth
                marginBottom0
                dataOptions={Object.entries(AgeCriteriaLabels).map(
                  ([value, label]) => ({
                    value: value as AgeCriteria,
                    label,
                  })
                )}
              />
              <Field
                name="assignmentCriteria"
                component={
                  Select<
                    AssignmentCriteria,
                    SelectFieldRenderProps<AssignmentCriteria>
                  >
                }
                required
                label={
                  <FormattedMessage id="ui-calendar.purgeModal.criteria.assignment.prompt" />
                }
                fullWidth
                marginBottom0
                dataOptions={Object.entries(AssignmentCriteriaLabels).map(
                  ([value, label]) => ({
                    value: value as AssignmentCriteria,
                    label,
                  })
                )}
              />
              <AccordionSet>
                <Accordion
                  label={
                    <FormattedMessage id="ui-calendar.purgeModal.deletionList.label" />
                  }
                  closedByDefault
                  headerProps={{
                    displayWhenClosed: (
                      <Badge color="default">{toPurge.length}</Badge>
                    ),
                    displayWhenOpen: (
                      <Badge color="default">{toPurge.length}</Badge>
                    ),
                  }}
                >
                  <List
                    items={toPurge.map((c) => c.name as string)}
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
