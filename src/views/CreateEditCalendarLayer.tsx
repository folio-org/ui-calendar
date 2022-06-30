import {
  Button,
  Layer,
  Loading,
  LoadingPane,
  Pane,
  PaneFooter,
  Paneset,
} from "@folio/stripes-components";
import React, { FunctionComponent, useState } from "react";
import DataRepository from "../data/DataRepository";
import CalendarForm, { FORM_ID } from "../forms/CalendarForm";
import { Calendar } from "../types/types";

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

function getOpType(initialValue?: Calendar, isEdit?: boolean): OpType {
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
  let pane = <LoadingPane />;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  if (props.dataRepository.isLoaded()) {
    const opType = getOpType(props.initialValue, props.isEdit);

    pane = (
      <Pane
        paneTitle={opType === OpType.EDIT ? "Edit" : "Create new calendar"}
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        footer={
          <PaneFooter
            renderStart={
              <Button onClick={() => props.onClose()}>Cancel</Button>
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
                {isSubmitting ? <Loading /> : "Save & close"}
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
          servicePoints={props.dataRepository.getServicePoints()}
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
    <Layer contentLabel="Calendar creation form" isOpen>
      <Paneset isRoot>{pane}</Paneset>
    </Layer>
  );
};
export default CreateEditCalendarLayer;
