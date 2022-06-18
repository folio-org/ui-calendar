import {
  Button,
  Layer,
  Loading,
  LoadingPane,
  Pane,
  PaneMenu,
  Paneset,
} from "@folio/stripes-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import CreateCalendarForm, { FORM_ID } from "./CreateCalendarForm";
import DataRepository from "./DataRepository";

export interface CreateCalendarLayerProps {
  dataRepository: DataRepository;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCalendarLayer: FunctionComponent<
  CreateCalendarLayerProps
> = (props: CreateCalendarLayerProps) => {
  let pane = <LoadingPane />;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /** Reset if the layer is closed or opened */
  useEffect(() => setIsSubmitting(false), [props.isOpen]);

  if (props.dataRepository.isLoaded()) {
    pane = (
      <Pane
        paneTitle="Create new calendar"
        defaultWidth="fill"
        centerContent
        onClose={props.onClose}
        dismissible
        lastMenu={
          <PaneMenu>
            <Button
              disabled={isSubmitting}
              buttonStyle="primary"
              marginBottom0
              type="submit"
              form={FORM_ID}
            >
              {isSubmitting ? <Loading /> : "Save"}
            </Button>
          </PaneMenu>
        }
      >
        <CreateCalendarForm
          closeParentLayer={props.onClose}
          setIsSubmitting={setIsSubmitting}
          servicePoints={props.dataRepository.getServicePoints()}
        />
      </Pane>
    );
  }

  return (
    <Layer contentLabel="Calendar creation form" isOpen={props.isOpen}>
      <Paneset isRoot>{pane}</Paneset>
    </Layer>
  );
};
export default CreateCalendarLayer;
