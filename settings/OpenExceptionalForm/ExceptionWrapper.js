import React from 'react';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';

class ExceptionWrapper extends React.Component {
    static propTypes = {
      onClose: PropTypes.func.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object
    };
    render() {
      const paneStartMenu = <PaneMenu><IconButton icon="closeX" onClick={this.props.onClose} /></PaneMenu>;
      const paneLastMenu = <PaneMenu><Button buttonStyle="primary">{CalendarUtils.translateToString('ui-calendar.exceptionalNewPeriod', this.props.stripes.intl)}</Button></PaneMenu>;
      const paneTitle = <PaneMenu><Icon icon="calendar" />{CalendarUtils.translateToString('ui-calendar.settings.library_hours', this.props.stripes.intl)}</PaneMenu>;

      return (
        <Paneset>
          <Pane defaultWidth="30%" paneTitle="Filters">
                    // Service Points selector
          </Pane>
          <Pane defaultWidth="fill" paneTitle={paneTitle} firstMenu={paneStartMenu} lastMenu={paneLastMenu}>
            <ExceptionalBigCalendar
                {...this.props}
            />
              {console.log("láásuk mi van itt")}
              {console.log(this.props.modifyPeriod)}
          </Pane>
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
