import type { FunctionComponent } from 'react';
import React from 'react';
import Settings, { CalendarSettingsProps } from './views/CalendarSettings';

const CalendarRouting: FunctionComponent<CalendarSettingsProps> = (props) => {
  if (props.showSettings) {
    return <Settings {...props} />;
  } else {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>How did you get to {props.location.pathname}?</p>
      </div>
    );
  }
};

export default CalendarRouting;
