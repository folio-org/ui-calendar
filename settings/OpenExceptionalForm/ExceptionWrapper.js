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
        }],
        editor: {
          editorServicePoints: [],
          name: null,
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          open: null,
          allDay: null,
          allSelector: null,
        }
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
      this.setEditorServicePoints(tempServicePoints);
      this.setServicePoints(tempServicePoints);
      this.getPeriods();
    }

    setStartDate(e) {
      this.setState({
        editor: {
          startDate: this.parseDateToString(e)
        }
      });
    }


    setEndDate(e) {
      this.setState({
        editor: {
          endDate: this.parseDateToString(e),
        }
      });
    }

    parseDateToString(e) {
      let str = '';
      for (const p in e) {
        if (p !== undefined) {
          if (Object.prototype.hasOwnProperty.call(e, p) && p !== 'preventDefault') {
            str += e[p];
          }
        }
      }
      return str;
    }

    setEditorServicePoints(e) {
      this.setState({
        editor: {
          editorServicePoints: e,
        }
      });
    }

    allSelectorHandle(select) {
      const tempServicePoints = this.state.editor.editorServicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        tempServicePoints[i].selected = select;
      }
      if (select === true) {
        this.setState({
          editor: {
            editorServicePoints: tempServicePoints,
            allSelector: false
          },
        });
      } else {
        this.setState({
          editor: {
            editorServicePoints: tempServicePoints,
            allSelector: true
          },
        });
      }
    }

    setClosed() {
      if (this.state.closed === false) {
        this.setState({
          editor: {
            closed: true
          }
        });
      } else {
        this.setState({
          editor: {
            closed: false
          }
        });
      }
    }

    setAllDay() {
      if (this.state.allDay === false) {
        this.setState({
          editor: {
            allDay: true,
            startTime: '00:00',
            endTime: '23:59',
          }
        });
      } else {
        this.setState({
          editor: {
            allDay: false
          }
        });
      }
    }

    setName(e) {
      this.setState({
        editor: {
          name: e.target.value,
        }
      });
    }

    setOpeningTime(e) {
      this.setState({
        editor: {
          openingTime: e.target.value,
        }
      });
    }

    setClosingTime(e) {
      this.setState({
        editor: {
          closingTime: e.target.value,
        }
      });
    }

    onToggleSelect(event) {
      event.selected = !event.selected;
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === event.id) {
          tempServicePoints[i].selected = event.selected;
        }
      }
      this.setState({
        editor: {
          servicePoints: tempServicePoints,
        }
      });
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
          {/* TODO open editor or selector
           <Pane defaultWidth="20%" paneTitle={CalendarUtils.translateToString('ui-calendar.servicePoints', this.props.stripes.intl)}>
           <ServicePointSelector
           {...this.props}
           handleServicePointChange={this.handleServicePointChange}
           setServicePoints={this.setServicePoints}
           servicePoints={this.state.servicePoints}
           />
           </Pane> */}
          <Pane defaultWidth="fill" paneTitle={paneTitle} firstMenu={paneStartMenu} lastMenu={paneLastMenu}>
            <ExceptionalBigCalendar
              {...this.props}
              myEvents={this.state.events}
            />
          </Pane>
          <Pane
            defaultWidth="20%"
            paneTitle={CalendarUtils.translateToString('ui-calendar.ExceptionPeriod', this.props.stripes.intl)}
            firstMenu={paneStartMenu}
            lastMenu={lastMenus}
          >
            <ExceptionalPeriodEditor
              {...this.props}
              servicePoints={this.state.editor.editorServicePoints}
              setStartDate={this.setStartDate}
              setEndDate={this.setEndDate}
              allSelectorHandle={this.allSelectorHandle}
              setClosed={this.setClosed}
              setAllDay={this.setAllDay}
              setName={this.setName}
              setOpeningTime={this.setOpeningTime}
              setClosingTime={this.setClosingTime}
              onToggleSelect={this.onToggleSelect}
              allSelector={this.state.allSelector}
              open={this.state.editor.open}
              allDay={this.state.editor.allDay}
            />
          </Pane>
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
