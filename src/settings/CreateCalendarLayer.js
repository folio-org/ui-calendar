import {
  Button,
  Layer,
  Pane,
  Icon,
  Paneset,
  PaneMenu,
  AccordionSet,
  Accordion,
} from "@folio/stripes-components";

export default function CreateCalendarLayer(props) {
  return (
    <Layer contentLabel="Calendar creation form" isOpen={props.isOpen}>
      <Paneset isRoot>
        <Pane
          paneTitle="Create new calendar"
          defaultWidth="fill"
          dismissible
          onClose={props.onClose}
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
          <AccordionSet>
            <Accordion label="General information">
              <ul>
                <li>All</li>
                <li>The</li>
                <li>Items!</li>
              </ul>
            </Accordion>
          </AccordionSet>
        </Pane>
      </Paneset>
    </Layer>
  );
}
