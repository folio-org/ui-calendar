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
      this.setEditorServicePoints = this.setEditorServicePoints.bind(this);
      this.handleServicePointChange = this.handleServicePointChange.bind(this);
      this.getPeriods = this.getPeriods.bind(this);
      this.saveException = this.saveException.bind(this);
      this.deleteException = this.deleteException.bind(this);
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.parseDateToString = this.parseDateToString.bind(this);
      this.allSelectorHandle = this.allSelectorHandle.bind(this);
      this.setClosed = this.setClosed.bind(this);
      this.setAllDay = this.setAllDay.bind(this);
      this.setName = this.setName.bind(this);
      this.setOpeningTime = this.setOpeningTime.bind(this);
      this.setClosingTime = this.setClosingTime.bind(this);
      this.setState({
        servicePoints: [],
        events: [{
          id: undefined,
          startDate: undefined,
          endDate: undefined,
        }],
        modifyExceptionId: null,
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

    saveException() {
      const promises = [];
      const { parentMutator } = this.props;
      for (let i = 0; i < this.state.editorServicePoints.length; i++) {
        if (this.state.editor.editorServicePoints[i].selected === true) {
          parentMutator.query.replace(this.state.editor.editorServicePoints[i].id);
          const exception = {
            servicePointId: this.state.editor.servicePoints[i],
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            openingDays: [{
              openingDay: {
                openingHour: [
                  {
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                  }
                ],
                allDay: this.state.allDay,
                open: this.state.open,
              }

            }]
          };
          const a = this.props.parentMutator.periods.POST(exception);
          promises.push(a);
        }
      }
      Promise.all(promises).then((openingAllPeriods) => {
        // TODO zárni a jobb oldali sávot, üríteni a this.state.editor-t, frissíteni a középső calt
      });
    }

    deleteException() {
      const promises = [];
      const { parentMutator } = this.props;
      for (let i = 0; i < this.state.editorServicePoints.length; i++) {
        parentMutator.query.replace(this.state.editor.servicePoints[i]);
        const exception = {
          id: this.state.modifyExceptionId,
        };
        const a = this.props.parentMutator.periods.DELETE(exception);
        promises.push(a);
      }
      Promise.all(promises).then((openingAllPeriods) => {
        // TODO zárni a jobb oldali sávot, üríteni a this.state.editor-t, frissíteni a középső calt
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
      const tempEditor = this.state.editor;
      tempEditor.startDate = this.parseDateToString(e);
      this.setState({
        editor: tempEditor
      });
    }

    setEndDate(e) {
      const tempEditor = this.state.editor;
      tempEditor.endDate = this.parseDateToString(e);
      this.setState({
        editor: tempEditor
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
      if (this.state !== null && this.state.editor !== null) {
        const tempEditor = this.state.editor;
        tempEditor.editorServicePoints = e;
        this.setState({
          editor: tempEditor,
        });
      } else {
        this.setState({
          editor: {
            editorServicePoints: e,
          }
        });
      }
    }

    allSelectorHandle(select, sP) {
      const tempServicePoints = sP;
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

    setClosed(e) {
      const tempEditor = this.state.editor;
      if (e === false) {
        tempEditor.closed = true;
        this.setState({
          editor: tempEditor
        });
      } else {
        tempEditor.closed = false;
        this.setState({
          editor: tempEditor
        });
      }
    }

    setAllDay(e) {
      const tempEditor = this.state.editor;
      if (e === false) {
        tempEditor.allDay = true;
        tempEditor.startTime = '00:00';
        tempEditor.endTime = '23:59';
        this.setState({
          editor: tempEditor,
        });
      } else {
        tempEditor.allDay = false;
        this.setState({
          editor: tempEditor,
        });
      }
    }

    setName(e) {
      const tempEditor = this.state.editor;
      tempEditor.name = e.target.value;
      this.setState({
        editor: tempEditor,
      });
    }

    setOpeningTime(e) {
      const tempEditor = this.state.editor;
      tempEditor.openingTime = e;
      this.setState({
        editor: tempEditor,
      });
    }

    setClosingTime(e) {
      const tempEditor = this.state.editor;
      tempEditor.closingTime = e;
      this.setState({
        editor: tempEditor
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
          <Button
            buttonStyle="danger"
            onClick={this.deleteException}
          >
            {CalendarUtils.translateToString('ui-calendar.deleteButton', this.props.stripes.intl)}
          </Button>
          <Button
            buttonStyle="primary"
            onClick={this.saveException}
          >
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
            // paneTitle={CalendarUtils.translateToString('ui-calendar.ExceptionPeriod', this.props.stripes.intl)}
            paneTitle="TODO"
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
              setEditorServicePoints={this.setEditorServicePoints}
              allSelector={this.state.editor.allSelector}
              open={this.state.editor.open}
              allDay={this.state.editor.allDay}
            />
          </Pane>
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
