import { SettingsProps } from '@folio/stripes/smart-components';
import React, { FunctionComponent } from 'react';
import { hot } from 'react-hot-loader';
import Settings from './views';

const CalendarRouting: FunctionComponent<SettingsProps> = (props) => {
  if (props.showSettings) {
    return <Settings {...props} />;
  } else {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>
          How did you get to
          {props.location.pathname}?
        </p>
      </div>
    );
  }
};

export default hot(module)(CalendarRouting);
