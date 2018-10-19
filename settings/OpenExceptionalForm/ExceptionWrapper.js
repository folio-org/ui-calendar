import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RandomColor from 'randomcolor';
import moment from 'moment';
import {
  Button,
  PaneMenu,
  IconButton,
  Icon,
  Pane,
  Paneset,
  ConfirmationModal,
  Modal
} from '@folio/stripes/components';
import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css';  // eslint-disable-line
import SafeHTMLMessage from '@folio/react-intl-safe-html' ;// eslint-disable-line

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
      this.setStartTime = this.setStartTime.bind(this);
      this.setEndTime = this.setEndTime.bind(this);
      this.separateEvents = this.separateEvents.bind(this);
      this.setting = this.setting.bind(this);
      this.checkBeforeSave = this.checkBeforeSave.bind(this);
      this.closeErrorModal = this.closeErrorModal.bind(this);
      this.settingALL = this.settingALL.bind(this);
      this.separateEvents = this.separateEvents.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.getAllServicePoints = this.getAllServicePoints.bind(this);
      this.clickOnEvent = this.clickOnEvent.bind(this);
      this.getServicePointToExceptional = this.getServicePointToExceptional.bind(this);
      this.onCloseEditor = this.onCloseEditor.bind(this);
      this.getStart = this.getStart.bind(this);
      this.getEnd = this.getEnd.bind(this);
      this.getOpen = this.getOpen.bind(this);
      this.getClose = this.getClose.bind(this);
      this.setDeleteQuestion = this.setDeleteQuestion.bind(this);
      this.beforeExit = this.beforeExit.bind(this);
      this.setState({
        servicePoints: [],
        openEditor: false,
        deleteQuestion: null,
        errorExceptionExit: false,
        errorEditorClose: false,
        changed: false,
        events: [{
          id: null,
          startDate: null,
          endDate: null,
        }],
        errorModalText: null,
        editor: {
          exceptionalIds: [{
            id: null,
            servicePointId: null,
          }],
          editorServicePoints: [],
          name: null,
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          closed: null,
          allDay: null,
          allSelector: null,
        },
        openingAllPeriods: [],
        disableEvents: false,
        modifyEvent: false,
        tempStart: null,
        tempClose: null
      });
    }

    componentWillMount() {      // eslint-disable-line react/no-deprecated
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = ['#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', '#e6194B'];
      for (let i = 22; i < this.props.entries.length; i++) {
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
      this.setState({ disableEvents: false });   // eslint-disable-line
    }

    setStartDate(e) {
      const tempDate = this.parseDateToString(e);
      this.setState(prevState => ({
        prevState,
        editor: {
          startDate: tempDate,
          endDate: prevState.editor.endDate,
          name: prevState.editor.name,
          startTime: prevState.editor.startTime,
          endTime: prevState.editor.endTime,
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: prevState.editor.closed,
          allday: prevState.editor.allDay,
          exceptionalIds: prevState.editor.exceptionalIds
        },
        changed: true
      }));
    }

    setEndDate(e) {
      const tempDate = this.parseDateToString(e);
      this.setState(prevState => ({
        prevState,
        editor: {
          endDate: tempDate,
          startDate: prevState.editor.startDate,
          name: prevState.editor.name,
          startTime: prevState.editor.startTime,
          endTime: prevState.editor.endTime,
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: prevState.editor.closed,
          allday: prevState.editor.allDay,
          exceptionalIds: prevState.editor.exceptionalIds
        },
        changed: true
      }));
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
        this.setState(prevState => ({
          prevState,
          editor: {
            endDate: prevState.editor.endDate,
            startDate: prevState.editor.startDate,
            name: prevState.editor.name,
            startTime: prevState.editor.startTime,
            endTime: prevState.editor.endTime,
            editorServicePoints: e,
            closed: prevState.editor.closed,
            allday: prevState.editor.allDay,
            exceptionalIds: prevState.editor.exceptionalIds
          },
        }));
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
      const tempEditor = this.state.editor;
      tempEditor.editorServicePoints = tempServicePoints;
      if (select === true) {
        tempEditor.editorServicePoints = tempServicePoints;
        tempEditor.allSelector = false;
      } else {
        tempEditor.editorServicePoints = tempServicePoints;
        tempEditor.allSelector = true;
      }
      this.setState({
        editor: tempEditor,
        changed: true
      });
    }

    setClosed(e) {
      if (e === false) {
        this.setState(prevState => ({
          prevState,
          editor: {
            endDate: prevState.editor.endDate,
            startDate: prevState.editor.startDate,
            name: prevState.editor.name,
            startTime: e,
            endTime: prevState.editor.endTime,
            editorServicePoints: prevState.editor.editorServicePoints,
            closed: true,
            allday: prevState.editor.allDay,
            exceptionalIds: prevState.editor.exceptionalIds
          },
          changed: true
        }));
      } else {
        this.setState(prevState => ({
          prevState,
          editor: {
            endDate: prevState.editor.endDate,
            startDate: prevState.editor.startDate,
            name: prevState.editor.name,
            startTime: e,
            endTime: prevState.editor.endTime,
            editorServicePoints: prevState.editor.editorServicePoints,
            closed: false,
            allday: prevState.editor.allDay,
            exceptionalIds: prevState.editor.exceptionalIds
          },
          changed: true
        }));
      }
    }

    setAllDay(e) {
      if (e === false || e === undefined) {
        this.setState(prevState => ({
          prevState,
          editor: {
            endDate: prevState.editor.endDate,
            startDate: prevState.editor.startDate,
            name: prevState.editor.name,
            startTime: '00:00',
            endTime: '23:59',
            editorServicePoints: prevState.editor.editorServicePoints,
            closed: false,
            allday: true,
            exceptionalIds: prevState.editor.exceptionalIds
          },
          changed: true
        }));
      } else {
        this.setState(prevState => ({
          prevState,
          editor: {
            endDate: prevState.editor.endDate,
            startDate: prevState.editor.startDate,
            name: prevState.editor.name,
            startTime: prevState.tempStart,
            endTime: prevState.tempClose,
            editorServicePoints: prevState.editor.editorServicePoints,
            closed: false,
            allday: false,
            exceptionalIds: prevState.editor.exceptionalIds
          },
          changed: true
        }));
      }
    }

    setName(e) {
      this.setState(prevState => ({
        prevState,
        editor: {
          endDate: prevState.editor.endDate,
          startDate: prevState.editor.startDate,
          name: e,
          startTime: prevState.editor.startTime,
          endTime: prevState.editor.endTime,
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: prevState.editor.closed,
          allday: prevState.editor.allDay,
          exceptionalIds: prevState.editor.exceptionalIds
        },
        changed: true
      }));
    }

    setStartTime(e) {
      this.setState(prevState => ({
        prevState,
        editor: {
          endDate: prevState.editor.endDate,
          startDate: prevState.editor.startDate,
          name: prevState.editor.name,
          startTime: e,
          endTime: prevState.editor.endTime,
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: prevState.editor.closed,
          allday: prevState.editor.allDay,
          exceptionalIds: prevState.editor.exceptionalIds
        },
        changed: true,
        tempStart: e,
      }));
    }

    setEndTime(e) {
      this.setState(prevState => ({
        prevState,
        editor: {
          endDate: prevState.editor.endDate,
          startDate: prevState.editor.startDate,
          name: prevState.editor.name,
          startTime: prevState.editor.startTime,
          endTime: e,
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: prevState.editor.closed,
          allday: prevState.editor.allDay,
          exceptionalIds: prevState.editor.exceptionalIds
        },
        changed: true,
        tempClose: e
      }));
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
        let eventContent;

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
            eventContent = <div className="rbc-event-dates-content">{dates}</div>;
          } else if (event.exceptional === true) {
            let allday = false;
            if (event.openingDays[j].openingDay.allDay === true) {
              dates.push(
                <div>All day</div>
              );
              allday = true;
            }
            if (allday === false) {
              for (let k = 0; k < event.openingDays[j].openingDay.openingHour.length; k++) {
                const tempOpen = event.openingDays[j].openingDay.openingHour[k].startTime;
                const resultOpen = tempOpen.split(':');
                const finalOpen = `${resultOpen[0]}:${resultOpen[1]}`;
                const tempEnd = event.openingDays[j].openingDay.openingHour[k].endTime;
                const resultEnd = tempEnd.split(':');
                const finalEnd = `${resultEnd[0]}:${resultEnd[1]}`;
                dates.push(
                  <div>
                    {finalOpen}
                    {' '}


                            -
                    {' '}
                    {finalEnd}
                  </div>
                );
                if (event.openingDays[j].openingDay.openingHour.length > 1 && event.openingDays[j].openingDay.openingHour.length > dates.length) {
                  dates.push(
                    <div>,</div>
                  );
                }
              }
            }
            eventContent = <div className="rbc-event-dates-content" style={{ border: '4px solid red', borderRadius: '4px' }}>{dates}</div>;
          }


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
            exceptional: event.exceptional,
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

    clickOnEvent(event) {
      for (let i = 0; i < this.state.openingAllPeriods.length; i++) {
        if (this.state.openingAllPeriods[i].id === event.id) {
          const filterStart = this.state.openingAllPeriods[i].startDate;
          const filterEnd = this.state.openingAllPeriods[i].endDate;
          const startTime = this.state.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].startTime;
          const endTime = this.state.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime;

          const tempServicePoints = [{
            servicePointId: null,
            tempColor: null,
            tempName: null,
            selected: null,
          }];

          const tempId = [];
          let tempSelected;
          let k = 0;
          let p = 0;
          for (let j = 0; j < this.state.openingAllPeriods.length; j++) {
            if (filterEnd === this.state.openingAllPeriods[j].endDate && filterStart === this.state.openingAllPeriods[j].startDate
            && startTime === this.state.openingAllPeriods[j].openingDays[0].openingDay.openingHour[0].startTime && endTime === this.state.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime) {
              tempId[k] =
                {
                  servicePointId: this.state.openingAllPeriods[j].servicePointId,
                  id: this.state.openingAllPeriods[j].id,
                };
              k++;
            }
          }

          for (let l = 0; l < this.state.servicePoints.length; l++) {
            for (let o = 0; o < tempId.length; o++) {
              if ((this.state.servicePoints[l].id === tempId[o].servicePointId) && (this.state.servicePoints[l].selected === true)) {
                tempSelected = true;
                break;
              } else {
                tempSelected = false;
              }
            }
            tempServicePoints[p] = {
              id: this.state.servicePoints[l].id,
              color: this.state.servicePoints[l].color,
              name: this.state.servicePoints[l].name,
              selected: tempSelected
            };
            p++;
          }
          const tempEditor = {
            exceptionalIds: tempId,
            startDate: this.state.openingAllPeriods[i].startDate,
            endDate: this.state.openingAllPeriods[i].endDate,
            name: this.state.openingAllPeriods[i].name,
            editorServicePoints: tempServicePoints,
            endTime: this.state.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime,
            startTime: this.state.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].startTime,
            allDay: this.state.openingAllPeriods[i].openingDays[0].openingDay.allDay,
          };

          this.setState({
            editor: tempEditor
          });
        }
      }
      this.setState({ openEditor: true });
    }

    getEvent(event) {
      if (event.exceptional === true && this.state.disableEvents === false) {
        this.clickOnEvent(event);
        this.setState({ disableEvents: true });
        this.setState({ modifyEvent: true });
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

    setDeleteQuestion() {
      this.setState({
        deleteQuestion: true,
      });
    }

    getServicePointToExceptional() {
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];

      for (let i = 0; i < this.state.servicePoints.length; i++) {
        const tempSP = {
          id: this.state.servicePoints[i].id,
          name: this.state.servicePoints[i].name,
          selected: false,
          color: this.state.servicePoints[i].color
        };

        tempServicePoints[i] = tempSP;
      }

      return tempServicePoints;
    }

    onCloseEditor() {
      this.setState({ openEditor: false,
        disableEvents: false,
        modifyEvent: false,
        editor: {
          exceptionalIds: [{
            id: null,
            servicePointId: null,
          }],
          editorServicePoints: [],
          name: null,
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
          closed: null,
          allSelector: null,
        } });
    }

    getStart() {
      if (this.state.editor.startDate !== null && this.state.editor.startDate !== undefined && this.state.modifyEvent === true) {
        return moment(this.state.editor.startDate).add(1, 'days').format('L');
      } else return '';
    }

    getEnd() {
      if (this.state.editor.endDate !== null && this.state.editor.endDate !== undefined && this.state.modifyEvent === true) {
        return moment(this.state.editor.endDate).add(1, 'days').format('L');
      } else return '';
    }

    getOpen() {
      if (this.state.editor !== null && this.state.editor !== undefined && this.state.modifyEvent === true) {
        return this.state.editor.startTime;
      } else return '';
    }

    getClose() {
      if (this.state.editor !== null && this.state.editor !== undefined && this.state.modifyEvent === true) {
        return this.state.editor.endTime;
      } else return '';
    }

    beforeExit(source) {
      if (source === 'editorStartMenu') {
        if (this.state.changed === true) {
          this.setState({ errorEditorClose: true,
            openEditor: false,
            disableEvents: false,
            editor: { exceptionalIds: [{
              id: null,
              servicePointId: null,
            }],
            editorServicePoints: [],
            name: null,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            closed: null,
            allDay: null,
            allSelector: null } });
        } else {
          this.setState({
            openEditor: false,
            disableEvents: false,
            editor: {
              exceptionalIds: [{
                id: null,
                servicePointId: null,
              }],
              editorServicePoints: [],
              name: null,
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
              closed: null,
              allDay: null,
              allSelector: null,
            }
          });
        }
      } else if (source === 'paneStartMenu') {
        if (this.state.changed === true) {
          this.setState({ errorExceptionExit: true });
        } else {
          return this.props.onClose();
        }
      }
      return null;
    }

    saveException() {
      const preCheck = this.checkBeforeSave();
      if (preCheck === true) {
        const promises = [];
        const { parentMutator } = this.props;
        const { editor } = this.state;
        if (this.state.editor.exceptionalIds === null || this.state.editor.exceptionalIds === undefined) {
          for (let i = 0; i < this.state.editor.editorServicePoints.length; i++) {
            if (this.state.editor.editorServicePoints[i].selected === true) {
              parentMutator.query.replace(this.state.editor.editorServicePoints[i].id);
              const exception = {
                servicePointId: editor.editorServicePoints[i].id,
                name: editor.name,
                startDate: editor.startDate,
                endDate: editor.endDate,
                openingDays: [{
                  openingDay: {
                    openingHour: [
                      {
                        startTime: editor.startTime,
                        endTime: editor.endTime,
                      }
                    ],
                    allDay: editor.allDay === undefined ? false : editor.allDay,
                    open: editor.closed === undefined ? false : editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                  }
                }]
              };
              const a = this.props.parentMutator.periods.POST(exception);
              promises.push(a);
            }
          }
        } else if (this.state.editor.exceptionalIds !== null && this.state.editor.exceptionalIds !== undefined && this.state.editor.exceptionalIds.length >= 0) {
          for (let i = 0; i < this.state.editor.exceptionalIds.length; i++) {
            const chekedId = this.state.editor.exceptionalIds[i].servicePointId;
            let action = 'POST';
            for (let j = 0; j < this.state.editor.editorServicePoints.length; j++) {
              if (this.state.editor.editorServicePoints[j].id === chekedId) {
                if (this.state.editor.editorServicePoints[j].selected === false) {
                  action = 'DELETE';
                } else {
                  action = 'PUT';
                }
              }
            }
            const index = i;
            if (action === 'DELETE') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[index].servicePointId);
              parentMutator.periodId.replace(this.state.editor.exceptionalIds[index].id);
              const modifyDelete = this.props.parentMutator.periods.DELETE(this.state.editor.exceptionalIds[index].id);
              promises.push(modifyDelete);
            } else if (action === 'PUT') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[index].servicePointId);
              parentMutator.periodId.replace(this.state.editor.exceptionalIds[index].id);
              const modifyExceptionPut = {
                id: this.state.editor.exceptionalIds[index].id,
                servicePointId: editor.exceptionalIds[index].servicePointId,
                name: editor.name,
                startDate: editor.startDate,
                endDate: editor.endDate,
                openingDays: [{
                  openingDay: {
                    openingHour: [
                      {
                        startTime: editor.startTime,
                        endTime: editor.endTime,
                      }
                    ],
                    allDay: editor.allDay === undefined ? false : editor.allDay,
                    open: editor.closed === undefined ? false : editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                  }
                }]
              };
              const modifyPromisePut = this.props.parentMutator.periods.PUT(modifyExceptionPut);
              promises.push(modifyPromisePut);
            } else if (action === 'POST') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[index].servicePointId);
              const modifyExceptionPost = {
                servicePointId: editor.exceptionalIds[index].servicePointId,
                name: editor.name,
                startDate: editor.startDate,
                endDate: editor.endDate,
                openingDays: [{
                  openingDay: {
                    openingHour: [
                      {
                        startTime: editor.startTime,
                        endTime: editor.endTime,
                      }
                    ],
                    allDay: editor.allDay === undefined ? false : editor.allDay,
                    open: editor.closed === undefined ? false : editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                  }
                }]
              };
              const modifyPromisPost = this.props.parentMutator.periods.POST(modifyExceptionPost);
              promises.push(modifyPromisPost);
            }
          }
        }
        Promise.all(promises).then(() => {
          this.setState({
            changed: false,
            openEditor: false,
            editor: {
              exceptionalIds: [{
                id: null,
                servicePointId: null,
              }],
              editorServicePoints: [],
              name: null,
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
              closed: null,
              allDay: null,
              allSelector: null,
            }
          });
          this.setAllDay(this.state.servicePoints);
        });
      } else {
        this.setState({
          errorModalText: preCheck,
        });
      }
      this.setState({ disableEvents: false });
    }

    deleteException() {
      const promises = [];
      const { parentMutator } = this.props;
      for (let i = 0; i < this.state.editor.exceptionalIds.length; i++) {
        parentMutator.query.replace(this.state.editor.exceptionalIds[i].servicePointId);
        parentMutator.periodId.replace(this.state.editor.exceptionalIds[i].id);
        const a = this.props.parentMutator.periods.DELETE(this.state.editor.exceptionalIds[i].id);
        promises.push(a);
      }
      Promise.all(promises).then(() => {
        this.setState({
          changed: false,
          deleteQuestion: false,
          openEditor: false,
          editor: {
            exceptionalIds: [{
              id: null,
              servicePointId: null,
            }],
            editorServicePoints: [],
            name: null,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            closed: null,
            allDay: false,
            allSelector: null,
          }
        });
        this.setAllDay(this.state.servicePoints);
      });
      this.setState({ disableEvents: false });
    }

    closeErrorModal() {
      this.setState({
        errorModalText: null,
      });
    }

    checkBeforeSave() {
      // return true ===  can save
      const { editor } = this.state;
      let errorMessage = null;
      let isServicePointSelected = false;
      for (let i = 0; i < editor.editorServicePoints.length; i++) {
        if (editor.editorServicePoints[i].selected === true) {
          isServicePointSelected = true;
        }
      }
      if (editor.startDate === null || editor.startDate === undefined || editor.startDate === '') {
        errorMessage = 'noStartDate';
      } else if (editor.endDate === null || editor.endDate === undefined || editor.endDate === '') {
        errorMessage = 'noEndDate';
      } else if (moment(editor.endDate).toDate() < moment(editor.startDate).toDate()) {
        errorMessage = 'wrongStartEndDate';
      } else if (editor.name === null || editor.name === undefined) {
        errorMessage = 'noName';
      } else if (!isServicePointSelected) {
        errorMessage = 'noServicePointSelected';
      } else if (editor.startTime === null || editor.startTime === undefined || editor.startTime === '') {
        errorMessage = 'noStartTime';
      } else if (editor.endTime === null || editor.endTime === undefined || editor.endTime === '') {
        errorMessage = 'noEndTime';
      } else if (moment(editor.endTime) < moment(editor.startTime)) {
        errorMessage = 'endTimeBeforeStartTime';
      }
      if (errorMessage === null) {
        return true;
      } else {
        return errorMessage;
      }
    }

    render() {
      let name = '';
      if (this.state.editor !== null && this.state.editor !== undefined) {
        name = this.state.editor.name;
      }


      const paneStartMenu =
        <PaneMenu>
          <IconButton icon="closeX" onClick={() => { this.beforeExit('paneStartMenu'); }} />
        </PaneMenu>;

      const editorStartMenu =
        <PaneMenu>
          <IconButton icon="closeX" onClick={() => { this.beforeExit('editorStartMenu'); }} />
        </PaneMenu>;

      const paneLastMenu =
        <PaneMenu>
          <div style={{ paddingRight: '15px', paddingTop: '15px' }}>
            <Button
              buttonStyle="primary"
              onClick={() => { this.setState({ openEditor: true }); }}
            >
              {CalendarUtils.translateToString('ui-calendar.exceptionalNewPeriod', this.props.stripes.intl)}
            </Button>
          </div>
        </PaneMenu>;

      let deleteButton = null;

      if (this.state.editor.exceptionalIds !== null && this.state.editor.exceptionalIds !== undefined) {
        deleteButton =
          <Button
            buttonStyle="danger"
            onClick={this.setDeleteQuestion}
          >
            {CalendarUtils.translateToString('ui-calendar.deleteButton', this.props.stripes.intl)}
          </Button>;
      }

      const saveButton =
        <Button
          buttonStyle="primary"
          onClick={this.saveException}
        >
          {CalendarUtils.translateToString('ui-calendar.saveButton', this.props.stripes.intl)}
        </Button>;

      const lastMenus =
        <div style={{ paddingRight: '15px', paddingTop: '15px' }}>
          {deleteButton}
          {saveButton}
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

      let editorPaneTittle = null;

      if (this.state.editor.exceptionalIds !== null && this.state.editor.exceptionalIds !== undefined) {
        editorPaneTittle = CalendarUtils.translateToString('ui-calendar.editExceptionPeriod', this.props.stripes.intl);
      } else {
        editorPaneTittle = CalendarUtils.translateToString('ui-calendar.newExceptionPeriod', this.props.stripes.intl);
      }

      const editorPane =
        <Pane
          defaultWidth="20%"
          paneTitle={editorPaneTittle}
          firstMenu={editorStartMenu}
          lastMenu={lastMenus}
        >
          <ExceptionalPeriodEditor
            {...this.props}
            editorServicePoints={this.state.editor.editorServicePoints}
            servicePoints={this.getServicePointToExceptional()}
            setStartDate={this.setStartDate}
            setEndDate={this.setEndDate}
            allSelectorHandle={this.allSelectorHandle}
            setClosed={this.setClosed}
            setAllDay={this.setAllDay}
            setName={this.setName}
            setStartTime={this.setStartTime}
            setEndTime={this.setEndTime}
            setEditorServicePoints={this.setEditorServicePoints}
            allSelector={this.state.editor.allSelector}
            open={this.state.editor.open}
            allDay={this.state.editor.allDay}
            editor={this.state.editor}
            isModify={this.state.modifyEvent}
            initialValues={
                {
                  item:
                        {
                          startDate: this.getStart(),
                          endDate: this.getEnd(),
                          periodName: name,
                          closingTime: this.getClose(),
                          openingTime: this.getOpen(),
                        }
                }
            }
          />
        </Pane>;

      const footer = (
        <Fragment>
          <Button
            onClick={this.closeErrorModal}
            ButtonStyle="primary"
          >
            {CalendarUtils.translateToString('ui-calendar.close', this.props.stripes.intl)}
          </Button>
        </Fragment>
      );

      let errorModal = null;
      if (this.state.errorModalText !== null && this.state.errorModalText !== undefined) {
        const label = 'ui-calendar.' + this.state.errorModalText;
        errorModal =
          <Modal
            dismissible
            onClose={this.closeErrorModal}
            open
            label={CalendarUtils.translateToString('ui-calendar.saveError', this.props.stripes.intl)}
            footer={footer}
          >
            <p>{CalendarUtils.translateToString(label, this.props.stripes.intl)}</p>
          </Modal>;
      }

      let deleteModal = null;
      if (this.state.deleteQuestion !== null && this.state.deleteQuestion !== undefined && this.state.deleteQuestion === true) {
        const text =
          <SafeHTMLMessage
            id="ui-calendar.deleteQuestionException"
            values={{ name }}
          />;
        deleteModal =
          <ConfirmationModal
            id="delete-confirmation"
            open={this.state.deleteQuestion}
            heading={CalendarUtils.translateToString('ui-calendar.deleteQuestionExceptionTitle', this.props.stripes.intl)}
            message={text}
            onConfirm={() => {
              this.deleteException();
            }}
            onCancel={() => {
              this.setState({ deleteQuestion: false });
            }}
            confirmLabel={CalendarUtils.translateToString('ui-calendar.deleteButton', this.props.stripes.intl)}
          />;
      }

      let errorCloseEditor = null;
      if (this.state.errorEditorClose === true) {
        const confirmationMessageClose = (
          <SafeHTMLMessage
            id="ui-calendar.exitQuestionMessage"
          />
        );
        errorCloseEditor =
          <ConfirmationModal
            id="exite-confirmation"
            open={this.state.errorEditorClose}
            heading={CalendarUtils.translateToString('ui-calendar.exitQuestionTitle', this.props.stripes.intl)}
            message={confirmationMessageClose}
            onConfirm={() => {
              this.setState({ errorEditorClose: false, openEditor: false });
            }}
            onCancel={() => {
              this.setState({ errorEditorClose: false });
            }}
            confirmLabel={CalendarUtils.translateToString('ui-calendar.closeWithoutSaving', this.props.stripes.intl)}
          />;
      }

      let errorExitException = null;
      if (this.state.errorExceptionExit === true) {
        const confirmationMessageExit = (
          <SafeHTMLMessage
            id="ui-calendar.exitQuestionMessage"
          />
        );
        errorExitException =
          <ConfirmationModal
            id="exite-confirmation"
            open={this.state.errorExceptionExit}
            heading={CalendarUtils.translateToString('ui-calendar.exitQuestionTitle', this.props.stripes.intl)}
            message={confirmationMessageExit}
            onConfirm={() => {
              return this.props.onClose();
            }}
            onCancel={() => {
              this.setState({ errorExceptionExit: false });
            }}
            confirmLabel={CalendarUtils.translateToString('ui-calendar.exitWithoutSaving', this.props.stripes.intl)}
          />;
      }
      return (
        <Paneset>
          { errorCloseEditor }
          { errorExitException }
          { errorModal }
          { deleteModal }
          { !this.state.openEditor && selectorPane }
          { calendarPane }
          { this.state.openEditor && editorPane }
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
