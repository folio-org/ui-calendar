import {
  Button,
  HotKeys,
  Layer,
  Pane,
  PaneMenu,
  Paneset,
} from "@folio/stripes-components";
import React, { FunctionComponent } from "react";
import CreateCalendarForm from "./CreateCalendarForm";

export interface CreateCalendarLayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCalendarLayer: FunctionComponent<
  CreateCalendarLayerProps
> = (props: CreateCalendarLayerProps) => {
  return (
    <HotKeys keyMap={{ close: ["esc"] }} handlers={{ close: props.onClose }}>
      <Layer contentLabel="Calendar creation form" isOpen={props.isOpen}>
        <Paneset isRoot>
          <Pane
            paneTitle="Create new calendar"
            defaultWidth="fill"
            centerContent
            onClose={props.onClose}
            dismissible
            lastMenu={
              <PaneMenu>
                <Button
                  buttonStyle="primary"
                  marginBottom0
                  onClick={props.onClose}
                >
                  Save
                </Button>
              </PaneMenu>
            }
          >
            <CreateCalendarForm />
          </Pane>
        </Paneset>
      </Layer>
    </HotKeys>
  );
};
export default CreateCalendarLayer;
