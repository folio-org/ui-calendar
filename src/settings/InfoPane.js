import {
  Button,
  MultiColumnList,
  Pane,
  PaneMenu,
} from "@folio/stripes-components";
import React, { useRef, useState } from "react";

export default function InfoPane(props) {
  if (!props.isDisplayed) {
    return null;
  }

  return (
    <Pane
      paneTitle={props.info.calendarName}
      defaultWidth="fill"
      centerContent={true}
      onClose={props.onClose}
      dismissible
      lastMenu={
        <PaneMenu>
          <Button buttonStyle="primary" marginBottom0 onClick={props.onClose}>
            TBD ACTIONS
          </Button>
        </PaneMenu>
      }
    >
      <h1>aAdfasdfasdfas</h1>
    </Pane>
  );
}
