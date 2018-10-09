import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  Paneset
} from '@folio/stripes/components';

import RandomColor from 'randomcolor';
import moment from 'moment';
import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line

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
      this.separateEvents = this.separateEvents.bind(this);
      this.setting = this.setting.bind(this);
      this.settingALL = this.settingALL.bind(this);
      this.separateEvents = this.separateEvents.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.getAllServicePoints = this.getAllServicePoints.bind(this);
      this.setState({
        servicePoints: [],
        openEditor: null,
        events: [{
          id: null,
          startDate: null,
          endDate: null,
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
        },
        openingAllPeriods: []
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

      });
    }

    componentWillMount() {      // eslint-disable-line react/no-deprecated
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = [];
      for (let i = 0; i < this.props.entries.length; i++) {
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
      this.setting(tempServicePoints);
    }

    componentDidMount() {
      this.getAllServicePoints();
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

    setting(sps) {
      const events = [];
      if (events.length === 0) {
        const event = {};
        event.start = null;
        event.end = null;
        event.id = null;
        events.push({ ...event });
      }

      this.setState({
        servicePoints: sps,
        events,
      });
    }

    settingALL(sps) {
      const events = [];
      let k = 0;
      let color = 'black';
      if (this.state.openingAllPeriods !== null && this.state.openingAllPeriods !== undefined) {
        for (let i = 0; i < this.state.openingAllPeriods.length; i++) {
          for (let j = 0; j < sps.length; j++) {
            if (sps[j].id === this.state.openingAllPeriods[i].servicePointId && sps[j].selected === true) {
              const event = {};
              event.start = this.state.openingAllPeriods[i].startDate;
              event.end = this.state.openingAllPeriods[i].endDate;
              event.id = this.state.openingAllPeriods[i].id;
              event.openingDays = this.state.openingAllPeriods[i].openingDays;

              if (this.state.servicePoints) {
                for (let l = 0; l < this.state.servicePoints.length; l++) {
                  if (this.state.servicePoints[l].id === this.state.openingAllPeriods[i].servicePointId) {
                    color = this.state.servicePoints[l].color;
                  }
                }
              }

              event.exceptional = this.state.openingAllPeriods[i].exceptional;
              event.color = color;
              const sepEvent = this.separateEvents(event);

              for (let g = 0; g < sepEvent.length; g++) {
                events[k] = sepEvent[g];
                k++;
              }
            }
          }
        }
      }

      if (events.length === 0) {
        const event = {};
        event.start = null;
        event.end = null;
        event.id = null;
        events.push({ ...event });
      }

      this.setState({
        servicePoints: sps,
        events,
      });
    }

    setServicePoints(sps) {
      this.setState({
        servicePoints: sps,
      });
      this.settingALL(sps);
    }

    separateEvents(event) {
      const temp = [];
      let g = 0;
      for (let i = 0; i < moment(event.end).diff(moment(event.start), 'days') + 1; i++) {
        const today = moment(event.start).add(i, 'days').format('dddd').toUpperCase();

        const dates = [];

        for (let j = 0; j < event.openingDays.length; j++) {
          if (event.exceptional === false) {
            if (today === event.openingDays[j].weekdays.day) {
              if (event.openingDays[j].openingDay.allDay === true) {
                dates.push(
                  <div>All day</div>
                );
              }
              for (let k = 0; k < event.openingDays[j].openingDay.openingHour.length; k++) {
                dates.push(
                  <div>
                    {event.openingDays[j].openingDay.openingHour[k].startTime}
                    {' '}

-
                    {' '}
                    {event.openingDays[j].openingDay.openingHour[k].endTime}
                  </div>
                );
                if (event.openingDays[j].openingDay.openingHour.length > 1 && event.openingDays[j].openingDay.openingHour.length > dates.length) {
                  dates.push(
                    <div>,</div>
                  );
                }
              }
            }
          } else if (event.exceptional === true) {
            if (event.openingDays[j].openingDay.allDay === true) {
              dates.push(
                <div>All day</div>
              );
            }
            for (let k = 0; k < event.openingDays[j].openingDay.openingHour.length; k++) {
              dates.push(
                <div style={{ border: '4px solid red' }}>
                  {event.openingDays[j].openingDay.openingHour[k].startTime}
                  {' '}

                          -
                  {' '}
                  {event.openingDays[j].openingDay.openingHour[k].endTime}
                </div>
              );
              if (event.openingDays[j].openingDay.openingHour.length > 1 && event.openingDays[j].openingDay.openingHour.length > dates.length) {
                dates.push(
                  <div>,</div>
                );
              }
            }
          }

          const eventContent = <div className="rbc-event-dates-content">{dates}</div>;
          const eventTitle =
            <div className="rbc-event-dates" style={{ backgroundColor: event.color }}>
              {' '}
              {eventContent}
            </div>;

          const tempObj = {
            id: event.id,
            end: moment(event.start).add(i, 'days'),
            start: moment(event.start).add(i, 'days'),
            title: eventTitle,
            exceptional: false
          };
          temp[g] = tempObj;
        }
        g++;
      }
      return temp;
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

    getEvent(event) {
      const res = {};

      for (let i = 0; i < this.state.openingAllPeriods.length; i++) {
        if (this.state.openingAllPeriods[i].id === event.id) {
          for (let j = 0; j < this.state.openingAllPeriods[i].openingDays.length; j++) {
            const day = moment(event.start).format('dddd').toUpperCase();
            if (day === this.state.openingAllPeriods[i].openingDays[j].weekdays.day) {
              this.setState({
                editor: {
                  startTime: this.state.openingAllPeriods[i].openingDays[j].openingDay.openingHour[0].startTime,
                  endTime: this.state.openingAllPeriods[i].openingDays[j].openingDay.openingHour[0].endTime,
                }
              });
              console.log(this.state);
            }
          }
          this.setState({
            editor: {
              servicePointId: this.state.openingAllPeriods[i].servicePointId,
              id: this.state.openingAllPeriods[i].id,
              startDate: this.state.openingAllPeriods[i].startDate,
              endDate: this.state.openingAllPeriods[i].endDate,
              name: this.state.openingAllPeriods[i].name,
              editorServicePoints: this.state.servicePoints,
            }
          });
        }
      }
    }

    getAllServicePoints() {
      const promises = [];

      for (let i = 0; i < this.props.entries.length; i++) {
        this.props.parentMutator.query.replace(this.props.entries[i].id);
        this.props.parentMutator.exceptional.replace('false');
        const a = this.props.parentMutator.periods.GET();
        promises.push(a);
      }

      for (let i = 0; i < this.props.entries.length; i++) {
        this.props.parentMutator.query.replace(this.props.entries[i].id);
        this.props.parentMutator.exceptional.replace('true');
        const a = this.props.parentMutator.periods.GET();
        promises.push(a);
      }

      let k = 0;
      const allSP = [];
      Promise.all(promises).then((openingAllPeriods) => {
        for (let i = 0; i < openingAllPeriods.length; i++) {
          const temp = openingAllPeriods[i];
          let exc = true;
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].openingDays[0].weekdays !== undefined && temp[j].openingDays[0].weekdays !== null) {
              exc = false;
            }
            const tempSP = {
              startDate: temp[j].startDate,
              endDate: temp[j].endDate,
              id: temp[j].id,
              name: temp[j].name,
              openingDays: temp[j].openingDays,
              servicePointId: temp[j].servicePointId,
              exceptional: exc,
            };
            allSP[k] = tempSP;
            k++;
          }
        }
        this.setState({
          openingAllPeriods: allSP
        });
      });
    }


    render() {
      let start = '';
      let end = '';
      let name = '';
      let open = '';
      let close = '';
      if (this.state.editor !== null && this.state.editor !== undefined) {
        start = moment(this.state.editor.startDate).format('L');
        end = moment(this.state.editor.endDate).format('L');
        name = this.state.editor.name;
        open = this.state.editor.openTime;
        close = this.state.editor.endTime;
      }
      const paneStartMenu =
        <PaneMenu>
          <IconButton icon="closeX" onClick={this.props.onClose} />
        </PaneMenu>;

      const editorStartMenu =
        <PaneMenu>
          <IconButton icon="closeX" onClick={() => this.setState({ openEditor: false })} />
        </PaneMenu>;

      const paneLastMenu =
        <PaneMenu>
          <Button
            buttonStyle="primary"
            onClick={() => { this.setState({ openEditor: true }); }}
          >
            {CalendarUtils.translateToString('ui-calendar.exceptionalNewPeriod', this.props.stripes.intl)}
          </Button>
        </PaneMenu>;

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

      const selectorPane =
        <Pane defaultWidth="20%" paneTitle={CalendarUtils.translateToString('ui-calendar.servicePoints', this.props.stripes.intl)}>
          <ServicePointSelector
            {...this.props}
            handleServicePointChange={this.handleServicePointChange}
            setServicePoints={this.setServicePoints}
            servicePoints={this.state.servicePoints}
          />
        </Pane>;

      const calendarPane =
        <Pane defaultWidth="fill" paneTitle={paneTitle} firstMenu={paneStartMenu} lastMenu={paneLastMenu}>
          <ExceptionalBigCalendar
            {...this.props}
            myEvents={this.state.events}
            getEvent={this.getEvent}
          />
        </Pane>;

      const editorPane =
        <Pane
          defaultWidth="20%"
          paneTitle="TODO"
          firstMenu={editorStartMenu}
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
            initialValues={
                {
                    item:
                        {
                            startDate: start,
                            endDate: end,
                            periodName: name,
                            openTime: open,
                            closingTime: close,
                        }
                }
            }
          />
        </Pane>;
      return (
        <Paneset>
          { !this.state.openEditor && selectorPane }
          { calendarPane }
          { this.state.openEditor && editorPane }
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
