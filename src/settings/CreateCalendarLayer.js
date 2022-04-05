import { Button, Layer, Pane, Paneset } from "@folio/stripes-components";

export default function CreateCalendarLayer(props) {
  return (
    <Layer isOpen={props.isOpen}>
      <Paneset isRoot>
        <Pane defaultWidth="fill">
          Content goes here
          <Button onClick={props.onClose}>Dismiss</Button>
        </Pane>
      </Paneset>
    </Layer>
  );
}
