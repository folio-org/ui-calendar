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
import CreateCalendarForm, { FORM_ID } from "../forms/CalendarForm";
import DataRepository from "../data/DataRepository";
import { Calendar } from "../types/types";

export interface CreateCalendarLayerProps {
  dataRepository: DataRepository;
  onClose: () => void;
}

export const CreateCalendarLayer: FunctionComponent<
  CreateCalendarLayerProps
> = (props: CreateCalendarLayerProps) => {
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
        <CreateCalendarForm
          closeParentLayer={props.onClose}
          setIsSubmitting={setIsSubmitting}
          submitAttempted={submitAttempted}
          dataRepository={props.dataRepository}
          servicePoints={props.dataRepository.getServicePoints()}
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
export default CreateCalendarLayer;
