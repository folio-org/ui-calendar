import React from 'react';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import ServicePointSelector from './ServicePointSelector';


class ExceptionWrapper extends React.Component {
  render() {
    return (

      <Paneset>
        <Pane defaultWidth="30%" paneTitle="Filters">
          <ServicePointSelector />
        </Pane>
        <Pane defaultWidth="fill" paneTitle="Search Results">
                    // Big Calendar Wrapper
        </Pane>
      </Paneset>
    );
  }
}

export default ExceptionWrapper;
