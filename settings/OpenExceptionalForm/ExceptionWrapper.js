import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RandomColor from 'randomcolor';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  Button,
  PaneMenu,
  IconButton,
  Icon,
  Pane,
  PaneFooter,
  Paneset,
  ConfirmationModal,
  Modal
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes-core';
import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css';  // eslint-disable-line
import SafeHTMLMessage from '@folio/react-intl-safe-html' ;// eslint-disable-line

import {
  colors,
  permissions,
} from '../constants';

class ExceptionWrapper extends React.Component {
  static propTypes = {
    entries: PropTypes.object,
    onClose: PropTypes.func.isRequired,
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
    this.setEvents = this.setEvents.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.getPeriods = this.getPeriods.bind(this);
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
      errors: [],
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
    for (let i = colors.length; i < this.props.entries.length; i++) {
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
    this.getPeriods();
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
        allDay: prevState.editor.allDay,
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
        allDay: prevState.editor.allDay,
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
          allDay: prevState.editor.allDay,
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

  allSelectorHandle(select, servicePoints) {
    const editorServicePoints = servicePoints.map(servicePoint => {
      servicePoint.selected = select;

      return servicePoint;
    });

    this.setState(prevState => {
      return {
        ...prevState,
        editor: {
          ...prevState.editor,
          editorServicePoints,
          allSelector: !select
        },
        changed: true
      };
    });
  }

  setClosed(e) {
    if (e === false || e === undefined || e === null) {
      this.setState(prevState => ({
        prevState,
        editor: {
          endDate: prevState.editor.endDate,
          startDate: prevState.editor.startDate,
          name: prevState.editor.name,
          startTime: '00:00',
          endTime: '23:59',
          editorServicePoints: prevState.editor.editorServicePoints,
          closed: true,
          allDay: true,
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
          allDay: false,
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
          closed: prevState.editor.closed,
          allDay: true,
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
          closed: prevState.editor.closed,
          allDay: false,
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
        allDay: prevState.editor.allDay,
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
        allDay: prevState.editor.allDay,
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
        allDay: prevState.editor.allDay,
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

  setEvents(sps) {
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
    this.setEvents(sps);
  }

  separateEvents(event) {
    const temp = [];
    let g = 0;
    for (let i = 0; i < moment(event.end)
      .diff(moment(event.start), 'days') + 1; i++) {
      const today = moment(event.start)
        .add(i, 'days')
        .format('dddd')
        .toUpperCase();

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
          eventContent =
            (
              <div
                className="rbc-event-dates-content"
                style={{
                  border: '4px solid red',
                  borderRadius: '4px'
                }}
              >
                {dates}
              </div>
            );
        }


        const eventTitle =
          <div className="rbc-event-dates" style={{ backgroundColor: event.color }}>
            {' '}
            {eventContent}
          </div>;

        const tempObj = {
          id: event.id,
          end: moment(event.start)
            .add(i, 'days'),
          start: moment(event.start)
            .add(i, 'days'),
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

        this.setState(prevState => ({
          prevState,
          editor: {
            exceptionalIds: tempId,
            startDate: prevState.openingAllPeriods[i].startDate,
            endDate: prevState.openingAllPeriods[i].endDate,
            name: prevState.openingAllPeriods[i].name,
            editorServicePoints: tempServicePoints,
            endTime: prevState.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime,
            startTime: prevState.openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].startTime,
            allDay: prevState.openingAllPeriods[i].openingDays[0].openingDay.allDay,
            closed: !prevState.openingAllPeriods[i].openingDays[0].openingDay.open,
          }
        }));
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

  getPeriods() {
    const promises = [];

    for (let i = 0; i < this.props.entries.length; i++) {
      this.props.parentMutator.query.replace(this.props.entries[i].id);
      this.props.parentMutator.exceptional.replace('false');
      const a = this.props.parentMutator.periods.GET();
      promises.push(a);
      this.props.parentMutator.query.replace(this.props.entries[i].id);
      this.props.parentMutator.exceptional.replace('true');
      const b = this.props.parentMutator.periods.GET();
      promises.push(b);
    }


    let k = 0;
    const allSP = [];
    Promise.all(promises)
      .then((openingAllPeriods) => {
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
        this.setEvents(this.state.servicePoints);
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
    this.setState({
      openEditor: false,
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
      }
    });
  }

  getStart() {
    if (this.state.editor.startDate !== null && this.state.editor.startDate !== undefined && this.state.modifyEvent === true) {
      return this.state.editor.startDate;
    } else {
      return '';
    }
  }

  getEnd() {
    if (this.state.editor.endDate !== null && this.state.editor.endDate !== undefined && this.state.modifyEvent === true) {
      return this.state.editor.endDate;
    } else {
      return '';
    }
  }

  getOpen() {
    if (this.state.editor !== null && this.state.editor !== undefined && this.state.modifyEvent === true) {
      return this.state.editor.startTime;
    } else {
      return '';
    }
  }

  getClose() {
    if (this.state.editor !== null && this.state.editor !== undefined && this.state.modifyEvent === true) {
      return this.state.editor.endTime;
    } else {
      return '';
    }
  }

  beforeExit(source) {
    if (source === 'editorStartMenu') {
      if (this.state.changed === true) {
        this.setState({
          errorEditorClose: true,
          disableEvents: false
        });
      } else {
        this.setState({
          openEditor: false,
          disableEvents: false,
          changed: false
        });
      }
    } else if (source === 'paneStartMenu') {
      if (this.state.changed === true) {
        this.setState({
          errorExceptionExit: true,
          modifyEvent: false
        });
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
                  open: editor.closed === undefined ? false : !editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
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
                  open: editor.closed === undefined ? false : !editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
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
                  open: editor.closed === undefined ? false : !editor.closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                }
              }]
            };
            const modifyPromisPost = this.props.parentMutator.periods.POST(modifyExceptionPost);
            promises.push(modifyPromisPost);
          }
        }
      }
      Promise.all(promises)
        .then(() => {
          this.setState({
            modifyEvent: false,
            disableEvents: false,
            changed: false,
            openEditor: false,
            editor: {
              exceptionalIds: undefined,
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
          const update = [];
          const promise = new Promise(() => this.getPeriods());
          update.push(promise);
          Promise.all(update)
            .then(() => {
              this.setEvents(this.state.servicePoints);
            });
        })
        .catch(async (response) => {
          const { errors } = await response.json();
          const errorCodes = errors.map(({ code }) => code);

          this.setState({ errors: errorCodes });
        });
    } else {
      this.setState({
        errors: [preCheck],
      });
    }
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
    Promise.all(promises)
      .then(() => {
        this.setState({
          disableEvents: false,
          changed: false,
          deleteQuestion: false,
          openEditor: false,
          modifyEvent: false,
          editor: {
            exceptionalIds: undefined,
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
        const update = [];
        const promise = new Promise(() => this.getPeriods());
        update.push(promise);
        Promise.all(update)
          .then(() => {
            this.setEvents(this.state.servicePoints);
          });
      });
  }

  closeErrorModal() {
    this.setState({
      errors: [],
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
    } else if (moment(editor.endDate)
      .toDate() < moment(editor.startDate)
      .toDate()) {
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
    const { errors } = this.state;
    let name = '';
    if (this.state.editor !== null && this.state.editor !== undefined) {
      name = this.state.editor.name;
    }

    const paneStartMenu =
      <PaneMenu>
        <IconButton
          icon="times"
          onClick={() => {
            this.beforeExit('paneStartMenu');
          }}
        />
      </PaneMenu>;

    const editorStartMenu =
      <PaneMenu>
        <IconButton
          data-test-close-button
          icon="times"
          onClick={() => {
            this.beforeExit('editorStartMenu');
          }}
        />
      </PaneMenu>;

    let deleteButton = null;

    if (this.state.modifyEvent) {
      deleteButton =
        <Button
          buttonStyle="danger"
          onClick={this.setDeleteQuestion}
        >
          <FormattedMessage id="ui-calendar.deleteButton" />
        </Button>;
    }

    const saveButton =
      <Button
        data-test-save-exceptional-period
        buttonStyle="primary"
        onClick={this.saveException}
      >
        <FormattedMessage id="ui-calendar.saveButton" />
      </Button>;

    const paneTitle =
      <PaneMenu>
        <Icon icon="calendar" />
        <FormattedMessage id="ui-calendar.settings.library_hours" />
      </PaneMenu>;

    const selectorPane =
      <Pane defaultWidth="20%" paneTitle={<FormattedMessage id="ui-calendar.servicePoints" />}>
        <ServicePointSelector
          {...this.props}
          handleServicePointChange={this.handleServicePointChange}
          setServicePoints={this.setServicePoints}
          servicePoints={this.state.servicePoints}
        />
      </Pane>;

    const calendarPane =
      <Pane
        data-test-big-calendar-wrapper
        defaultWidth="fill"
        paneTitle={paneTitle}
        firstMenu={paneStartMenu}
        footer={(
          <PaneFooter
            renderStart={(
              <Button
                data-test-cancel-exception-form
                marginBottom0
                onClick={() => { this.beforeExit('paneStartMenu'); }}
              >
                <FormattedMessage id="ui-calendar.common.cancel" />
              </Button>
            )}
            renderEnd={(
              <IfPermission perm={permissions.POST}>
                <Button
                  data-test-exceptional-new-period-button
                  buttonStyle="primary"
                  onClick={() => { this.setState({ openEditor: true }); }}
                >
                  <FormattedMessage id="ui-calendar.exceptionalNewPeriod" />
                </Button>
              </IfPermission>
            )}
          />
        )}
      >
        <ExceptionalBigCalendar
          {...this.props}
          myEvents={this.state.events}
          getEvent={this.getEvent}
        />
      </Pane>;

    let editorPaneTittle = null;

    if (this.state.editor.exceptionalIds !== null && this.state.editor.exceptionalIds !== undefined) {
      editorPaneTittle = <FormattedMessage id="ui-calendar.editExceptionPeriod" />;
    } else {
      editorPaneTittle = <FormattedMessage id="ui-calendar.newExceptionPeriod" />;
    }

    const editorPane =
      <Pane
        defaultWidth="20%"
        paneTitle={editorPaneTittle}
        firstMenu={editorStartMenu}
        footer={(
          <PaneFooter
            renderStart={(
              <Button
                data-test-cancel-exception-period
                marginBottom0
                onClick={() => { this.beforeExit('editorStartMenu'); }}
              >
                <FormattedMessage id="ui-calendar.common.cancel" />
              </Button>
            )}
            renderEnd={(
              <React.Fragment>
                <IfPermission perm={permissions.DELETE}>
                  {deleteButton}
                </IfPermission>
                <IfPermission perm={permissions.PUT}>
                  {saveButton}
                </IfPermission>
              </React.Fragment>
            )}
          />
        )}
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
          closed={this.state.editor.closed}
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
          data-test-close-button
          onClick={this.closeErrorModal}
          ButtonStyle="primary"
        >
          <FormattedMessage id="ui-calendar.close" />
        </Button>
      </Fragment>
    );

    let errorModal = null;

    if (!isEmpty(errors)) {
      const errorMessages = errors.map(errorCode => <FormattedMessage tagName="p" id={`ui-calendar.${errorCode}`} />);

      errorModal =
        <Modal
          data-test-error-modal
          dismissible
          onClose={this.closeErrorModal}
          open
          label={<FormattedMessage id="ui-calendar.saveError" />}
          footer={footer}
        >
          {errorMessages}
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
          heading={<FormattedMessage id="ui-calendar.deleteQuestionExceptionTitle" />}
          message={text}
          onConfirm={() => {
            this.deleteException();
          }}
          onCancel={() => {
            this.setState({ deleteQuestion: false });
          }}
          confirmLabel={<FormattedMessage id="ui-calendar.deleteButton" />}
        />;
    }

    let errorCloseEditor = null;
    if (this.state.errorEditorClose === true) {
      errorCloseEditor =
        <ConfirmationModal
          id="exite-confirmation"
          open={this.state.errorEditorClose}
          heading={<FormattedMessage id="ui-calendar.exitQuestionTitle" />}
          message={<SafeHTMLMessage id="ui-calendar.exitQuestionMessage" />}
          onConfirm={() => {
            this.setState({
              errorEditorClose: false,
              changed: false,
              openEditor: false,
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
                allDay: null,
                allSelector: null,
              }
            });
          }}
          onCancel={() => {
            this.setState({ errorEditorClose: false });
          }}
          confirmLabel={<FormattedMessage id="ui-calendar.closeWithoutSaving" />}
        />;
    }

    let errorExitException = null;
    if (this.state.errorExceptionExit === true) {
      errorExitException =
        <ConfirmationModal
          id="exite-confirmation"
          open={this.state.errorExceptionExit}
          heading={<FormattedMessage id="ui-calendar.exitQuestionTitle" />}
          message={<SafeHTMLMessage id="ui-calendar.exitQuestionMessage" />}
          onConfirm={() => {
            return this.props.onClose();
          }}
          onCancel={() => {
            this.setState({ errorExceptionExit: false });
          }}
          confirmLabel={<FormattedMessage id="ui-calendar.exitWithoutSaving" />}
        />;
    }
    return (
      <Paneset>
        {errorCloseEditor}
        {errorExitException}
        {errorModal}
        {deleteModal}
        {!this.state.openEditor && selectorPane}
        {calendarPane}
        {this.state.openEditor && editorPane}
      </Paneset>
    );
  }
}

export default ExceptionWrapper;
