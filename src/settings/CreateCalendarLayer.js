import {
  Button,
  HasCommand,
  Layer,
  Pane,
  PaneMenu,
  Paneset,
} from "@folio/stripes-components";
import CreateCalendarForm from "./CreateCalendarForm";

export default function CreateCalendarLayer(props) {
  return (
    <HasCommand
      commands={[{ name: "cancel", handler: props.onClose, shortcut: "esc" }]}
    >
      <Layer contentLabel="Calendar creation form" isOpen={props.isOpen}>
        <Paneset isRoot>
          <Pane
            paneTitle="Create new calendar"
            defaultWidth="fill"
            centerContent={true}
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
    </HasCommand>
  );
}
