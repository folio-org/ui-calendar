import {
  Button,
  Layer,
  Loading,
  LoadingPane,
  Pane,
  PaneFooter,
  Paneset,
} from "@folio/stripes-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import DataRepository from "../data/DataRepository";
import CalendarForm, { FORM_ID } from "../forms/CalendarForm";
import { Calendar } from "../types/types";

export interface CreateEditCalendarLayerProps {
  dataRepository: DataRepository;
  initialValues?: Calendar;
  onClose: () => void;
}

export const CreateEditCalendarLayer: FunctionComponent<
  CreateEditCalendarLayerProps
> = (props: CreateEditCalendarLayerProps) => {
  let pane = <LoadingPane />;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  /** Reset if the layer is closed or opened */
  useEffect(() => setIsSubmitting(false), []);

  if (props.dataRepository.isLoaded()) {
    pane = (
      <Pane
        paneTitle="Create new calendar"
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        footer={
          <PaneFooter
            renderStart={<Button onClick={props.onClose}>Cancel</Button>}
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
          initialValues={props.initialValues}
          submitter={(calendar: Calendar): Promise<Calendar> => {
            return props.dataRepository.createCalendar(calendar);
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
