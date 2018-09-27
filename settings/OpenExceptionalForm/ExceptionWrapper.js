import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import RandomColor from 'randomcolor';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import Button from '@folio/stripes-components/lib/Button';
import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';

class ExceptionWrapper extends React.Component {
    static propTypes = {
      entries: PropTypes.object,
      onClose: PropTypes.func.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object
    };

    constructor() {
      super();
      this.setServicePoints = this.setServicePoints.bind(this);
      this.handleServicePointChange = this.handleServicePointChange.bind(this);
      this.getPeriods = this.getPeriods.bind(this);
      this.setState({
        servicePoints: [],
        events: [{
          id: undefined,
          startDate: undefined,
          endDate: undefined,
        }]
      });
    }

    componentDidMount() {
      this.getPeriods();
    }

    componentWillMount() {      // eslint-disable-line react/no-deprecated
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = [10];
      for (let i = 0; i < 10; i++) {
        colors[i] = RandomColor({
          luminosity: 'random',
          hue: 'random'
        });
      }
      for (let i = 0; i < this.props.entries.length; i++) {
        const tempSP = {
          id: this.props.entries[i].id,
          name: this.props.entries[i].name,
          selected: false,
          color: colors[i],
        };
        tempServicePoints[i] = tempSP;
      }
      this.setServicePoints(tempServicePoints);
      this.getPeriods();
    }

    setServicePoints(sps) {
      this.setState({
        servicePoints: sps,
      });
    }

    handleServicePointChange(sp) {
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === sp.id) {
          tempServicePoints.selected = sp.selected;
        }
      }
      this.setServicePoints(tempServicePoints);
    }

    getPeriods() {
      const events = [];
      for (let i = 0; i < this.props.periods.length; i++) {
        const event = {};
        event.start = this.props.periods[i].startDate;
        event.end = this.props.periods[i].endDate;
        event.id = this.props.periods[i].id;
        events.push({ ...event });
      }

      this.setState({
        events
      });
    }

    render() {
      const paneStartMenu = <PaneMenu><IconButton icon="closeX" onClick={this.props.onClose} /></PaneMenu>;
      const paneLastMenu = <PaneMenu><Button buttonStyle="primary">{CalendarUtils.translateToString('ui-calendar.exceptionalNewPeriod', this.props.stripes.intl)}</Button></PaneMenu>;
      const lastMenus =
        <div>
          <Button buttonStyle="danger">
            {CalendarUtils.translateToString('ui-calendar.deleteButton', this.props.stripes.intl)}
          </Button>
          <Button buttonStyle="primary">
            {CalendarUtils.translateToString('ui-calendar.saveButton', this.props.stripes.intl)}
          </Button>
        </div>;

      const paneTitle =
        <PaneMenu>
          <Icon icon="calendar" />
          {CalendarUtils.translateToString('ui-calendar.settings.library_hours', this.props.stripes.intl)}
        </PaneMenu>;

      return (
        <Paneset>
            {/*TODO open editor or selector*/}
          {/* <Pane defaultWidth="30%" paneTitle={CalendarUtils.translateToString('ui-calendar.servicePoints', this.props.stripes.intl)}> */}
          {/* <ServicePointSelector */}
          {/* {...this.props} */}
          {/* handleServicePointChange={this.handleServicePointChange} */}
          {/* setServicePoints={this.setServicePoints} */}
          {/* servicePoints={this.state.servicePoints} */}
          {/* /> */}
          {/* </Pane> */}
          <Pane defaultWidth="fill" paneTitle={paneTitle} firstMenu={paneStartMenu} lastMenu={paneLastMenu}>
            <ExceptionalBigCalendar
              {...this.props}
              myEvents={this.state.events}
            />
          </Pane>
          <Pane
            defaultWidth="30%"
            paneTitle={CalendarUtils.translateToString('ui-calendar.ExceptionPeriod', this.props.stripes.intl)}
            firstMenu={paneStartMenu}
            lastMenu={lastMenus}
          >
            <ExceptionalPeriodEditor
              {...this.props}
              servicePoints={this.state.servicePoints}
            />
          </Pane>
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
