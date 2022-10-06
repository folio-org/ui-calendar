import {
  Button,
  Layer,
  Loading,
  LoadingPane,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes/components';
import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import DataRepository from '../data/DataRepository';
import CalendarForm, { FORM_ID } from '../forms/CalendarForm/CalendarForm';
import { Calendar } from '../types/types';

export interface CreateEditCalendarLayerProps {
  dataRepository: DataRepository;
  onClose: (id?: string) => void;
  initialValue?: Calendar;
  isEdit?: boolean;
}

enum OpType {
  CREATE_NEW,
  EDIT,
  DUPLICATE,
}

export function getOpType(initialValue?: Calendar, isEdit?: boolean): OpType {
  if (initialValue === undefined) {
    return OpType.CREATE_NEW;
  }
  if (isEdit) {
    return OpType.EDIT;
  }
  return OpType.DUPLICATE;
}

export const CreateEditCalendarLayer: FunctionComponent<
  CreateEditCalendarLayerProps
> = (props: CreateEditCalendarLayerProps) => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  let pane = <LoadingPane />;

  if (props.dataRepository.isLoaded()) {
    const opType = getOpType(props.initialValue, props.isEdit);

    pane = (
      <Pane
        paneTitle={
          getOpType(props.initialValue, props.isEdit) === OpType.EDIT ? (
            <FormattedMessage id="ui-calendar.calendarForm.title.edit" />
          ) : (
            <FormattedMessage id="ui-calendar.calendarForm.title.create" />
          )
        }
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        footer={
          <PaneFooter
            renderStart={
              <Button onClick={() => props.onClose()}>
                <FormattedMessage id="stripes-core.button.cancel" />
              </Button>
            }
            renderEnd={
              <Button
                disabled={isSubmitting}
                buttonStyle="primary"
                marginBottom0
                type="submit"
                form={FORM_ID}
                onClick={() => setSubmitAttempted(true)}
              >
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <FormattedMessage id="stripes-core.button.saveAndClose" />
                )}
              </Button>
            }
          />
        }
      >
        <CalendarForm
          closeParentLayer={props.onClose}
          setIsSubmitting={setIsSubmitting}
          submitAttempted={submitAttempted}
          dataRepository={props.dataRepository}
          initialValues={props.initialValue}
          submitter={(calendar: Calendar): Promise<Calendar> => {
            if (opType === OpType.EDIT) {
              const newCalendar = {
                ...calendar,
                id: props.initialValue?.id as string,
              };
              return props.dataRepository.updateCalendar(newCalendar);
            } else {
              return props.dataRepository.createCalendar(calendar);
            }
          }}
        />
      </Pane>
    );
  }

  return (
    <Layer
      contentLabel={intl.formatMessage({
        id:
          getOpType(props.initialValue, props.isEdit) === OpType.EDIT
            ? 'ui-calendar.calendarForm.title.edit'
            : 'ui-calendar.calendarForm.title.create',
      })}
      isOpen
    >
      <Paneset isRoot>{pane}</Paneset>
    </Layer>
  );
};
export default CreateEditCalendarLayer;
