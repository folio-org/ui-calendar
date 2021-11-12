import React, { Component, Fragment } from 'react';
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
import { IfPermission } from '@folio/stripes/core';
import SafeHTMLMessage from '@folio/react-intl-safe-html' ;// eslint-disable-line

import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css';  // eslint-disable-line

import {
  colors,
  permissions,
  ALL_DAY,
} from '../constants';

import { setTimezoneOffset } from '../utils/time';

class ExceptionWrapper extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object
  };

  constructor(props) {
    super(props);

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

  UNSAFE_componentWillMount() {      // eslint-disable-line react/no-deprecated, camelcase
    const tempServicePoints = [{
      id: null,
      name: null,
      selected: null,
      color: null,
    }];
    const { entries } = this.props;

    for (let i = colors.length; i < entries.length; i++) {
      colors[i] = RandomColor({
        luminosity: 'random',
        hue: 'random'
      });
    }
    for (let i = 0; i < entries.length; i++) {
      const tempSP = {
        id: entries[i].id,
        name: entries[i].name,
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

  setStartDate = e => {
    const tempDate = this.parseDateToString(e);
    this.setState(prevState => ({
      ...prevState,
      editor: {
        ...prevState.editor,
        startDate: tempDate,
      },
      changed: true
    }));
  }

  setEndDate = e => {
    const tempDate = this.parseDateToString(e);
    this.setState(prevState => ({
      ...prevState,
      editor: {
        ...prevState.editor,
        endDate: tempDate,
      },
      changed: true
    }));
  }

  parseDateToString = e => {
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

  setEditorServicePoints = e => {
    if (this.state !== null && this.state.editor !== null) {
      this.setState(prevState => ({
        ...prevState,
        editor: {
          ...prevState.editor,
          editorServicePoints: e,
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

  allSelectorHandle = (select, servicePoints) => {
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

  setClosed = e => {
    if (e === false || e === undefined || e === null) {
      this.setState(prevState => ({
        ...prevState,
        editor: {
          ...prevState.editor,
          startTime: '00:00',
          endTime: '23:59',
          closed: true,
          allDay: true,
        },
        changed: true
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        editor: {
          ...prevState.editor,
          startTime: prevState.tempStart,
          endTime: prevState.tempClose,
          closed: false,
          allDay: false,
        },
        changed: true
      }));
    }
  }

  setAllDay = e => {
    if (e === false || e === undefined) {
      this.setState(prevState => ({
        ...prevState,
        editor: {
          ...prevState.editor,
          startTime: '00:00',
          endTime: '23:59',
          allDay: true,
        },
        changed: true
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        editor: {
          ...prevState.editor,
          startTime: prevState.tempStart,
          endTime: prevState.tempClose,
          allDay: false,
        },
        changed: true
      }));
    }
  }

  setName = e => {
    this.setState(prevState => ({
      ...prevState,
      editor: {
        ...prevState.editor,
        name: e,
      },
      changed: true
    }));
  }

  setStartTime = e => {
    this.setState(prevState => ({
      ...prevState,
      editor: {
        ...prevState.editor,
        startTime: e,
      },
      changed: true,
      tempStart: e,
    }));
  }

  setEndTime = e => {
    this.setState(prevState => ({
      ...prevState,
      editor: {
        ...prevState.editor,
        endTime: e,
      },
      changed: true,
      tempClose: e
    }));
  }

  setting = sps => {
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

  setEvents = sps => {
    const events = [];
    const {
      openingAllPeriods,
      servicePoints,
    } = this.state;
    let k = 0;
    let color = 'black';

    if (openingAllPeriods !== null && openingAllPeriods !== undefined) {
      for (let i = 0; i < openingAllPeriods.length; i++) {
        for (let j = 0; j < sps.length; j++) {
          if (sps[j].id === openingAllPeriods[i].servicePointId && sps[j].selected === true) {
            const event = {};
            event.start = openingAllPeriods[i].startDate;
            event.end = openingAllPeriods[i].endDate;
            event.id = openingAllPeriods[i].id;
            event.openingDays = openingAllPeriods[i].openingDays;

            if (servicePoints) {
              for (let l = 0; l < servicePoints.length; l++) {
                if (servicePoints[l].id === openingAllPeriods[i].servicePointId) {
                  color = servicePoints[l].color;
                }
              }
            }

            event.exceptional = openingAllPeriods[i].exceptional;
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

  setServicePoints = sps => {
    this.setState({
      servicePoints: sps,
    });
    this.setEvents(sps);
  }

  separateEvents = event => {
    const temp = [];
    const {
      start,
      end,
      openingDays,
      exceptional,
      id,
    } = event;
    let g = 0;

    for (let i = 0; i < moment.utc(end)
      .diff(moment.utc(start), 'days') + 1; i++) {
      const today = setTimezoneOffset(start)
        .add(i, 'days')
        .format('dddd')
        .toUpperCase();

      const dates = [];
      let eventContent;

      for (let j = 0; j < openingDays.length; j++) {
        const openingHour = openingDays[j].openingDay.openingHour;

        if (exceptional === false) {
          if (today === openingDays[j].weekdays.day) {
            if (openingDays[j].openingDay.allDay === true) {
              dates.push(
                <div>{ALL_DAY}</div>
              );
            }
            for (let k = 0; k < openingHour.length; k++) {
              dates.push(
                <div>
                  {openingHour[k].startTime}
                  {' '}


                  -
                  {' '}
                  {openingHour[k].endTime}
                </div>
              );
              if (openingHour.length > 1 && openingHour.length > dates.length) {
                dates.push(
                  <div>,</div>
                );
              }
            }
          }
          eventContent = <div className="rbc-event-dates-content">{dates}</div>;
        } else if (exceptional === true) {
          let allday = false;
          if (openingDays[j].openingDay.allDay === true) {
            dates.push(
              <div>{ALL_DAY}</div>
            );
            allday = true;
          }
          if (allday === false) {
            for (let k = 0; k < openingHour.length; k++) {
              const tempOpen = openingHour[k].startTime;
              const resultOpen = tempOpen.split(':');
              const finalOpen = `${resultOpen[0]}:${resultOpen[1]}`;
              const tempEnd = openingHour[k].endTime;
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
              if (openingHour.length > 1 && openingHour.length > dates.length) {
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

        const eventStart = setTimezoneOffset(start).add(i, 'days');
        const tempObj = {
          id,
          end: eventStart.clone(),
          start: eventStart,
          title: eventTitle,
          exceptional,
        };
        temp[g] = tempObj;
      }
      g++;
    }
    return temp;
  }

  handleServicePointChange = sp => {
    const tempServicePoints = this.state.servicePoints;
    for (let i = 0; i < tempServicePoints.length; i++) {
      if (tempServicePoints[i].id === sp.id) {
        tempServicePoints.selected = sp.selected;
      }
    }
    this.setServicePoints(tempServicePoints);
  }

  clickOnEvent = event => {
    const {
      openingAllPeriods,
      servicePoints,
    } = this.state;

    for (let i = 0; i < openingAllPeriods.length; i++) {
      if (openingAllPeriods[i].id === event.id) {
        const filterStart = openingAllPeriods[i].startDate;
        const filterEnd = openingAllPeriods[i].endDate;
        const startTime = openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].startTime;
        const endTime = openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime;

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
        for (let j = 0; j < openingAllPeriods.length; j++) {
          if (filterEnd === openingAllPeriods[j].endDate && filterStart === openingAllPeriods[j].startDate
            && startTime === openingAllPeriods[j].openingDays[0].openingDay.openingHour[0].startTime && endTime === openingAllPeriods[i].openingDays[0].openingDay.openingHour[0].endTime) {
            tempId[k] =
              {
                servicePointId: openingAllPeriods[j].servicePointId,
                id: openingAllPeriods[j].id,
              };
            k++;
          }
        }

        for (let l = 0; l < servicePoints.length; l++) {
          for (let o = 0; o < tempId.length; o++) {
            if ((servicePoints[l].id === tempId[o].servicePointId) && (servicePoints[l].selected === true)) {
              tempSelected = true;
              break;
            } else {
              tempSelected = false;
            }
          }
          tempServicePoints[p] = {
            id: servicePoints[l].id,
            color: servicePoints[l].color,
            name: servicePoints[l].name,
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

  getEvent = event => {
    if (event.exceptional === true && this.state.disableEvents === false) {
      this.clickOnEvent(event);
      this.setState({ disableEvents: true });
      this.setState({ modifyEvent: true });
    }
  }

  getPeriods = () => {
    const promises = [];
    const { entries, parentMutator: { query, exceptional, periods } } = this.props;

    for (let i = 0; i < entries.length; i++) {
      query.replace(entries[i].id);
      exceptional.replace('false');
      const receivedPeriods1 = periods.GET();
      promises.push(receivedPeriods1);
      query.replace(entries[i].id);
      exceptional.replace('true');
      const receivedPeriods2 = periods.GET();
      promises.push(receivedPeriods2);
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
              endDate: moment(temp[j].endDate).toISOString(),
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

  setDeleteQuestion = () => {
    this.setState({
      deleteQuestion: true,
    });
  }

  getServicePointToExceptional = () => {
    const tempServicePoints = [{
      id: null,
      name: null,
      selected: null,
      color: null,
    }];
    const { servicePoints } = this.state;

    for (let i = 0; i < servicePoints.length; i++) {
      const tempSP = {
        id: servicePoints[i].id,
        name: servicePoints[i].name,
        selected: false,
        color: servicePoints[i].color
      };

      tempServicePoints[i] = tempSP;
    }

    return tempServicePoints;
  }

  onCloseEditor = () => {
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

  getStart = () => {
    const {
      modifyEvent,
      editor: {
        startDate,
      },
    } = this.state;

    if (startDate !== null && startDate !== undefined && modifyEvent === true) {
      return startDate;
    } else {
      return '';
    }
  }

  getEnd = () => {
    const {
      modifyEvent,
      editor: {
        endDate,
      }
    } = this.state;

    if (endDate !== null && endDate !== undefined && modifyEvent === true) {
      return endDate;
    } else {
      return '';
    }
  }

  getOpen = () => {
    const {
      modifyEvent,
      editor,
      editor: {
        startTime,
      }
    } = this.state;

    if (editor !== null && editor !== undefined && modifyEvent === true) {
      return startTime;
    } else {
      return '';
    }
  }

  getClose = () => {
    const {
      modifyEvent,
      editor,
      editor: {
        endTime,
      }
    } = this.state;

    if (editor !== null && editor !== undefined && modifyEvent === true) {
      return endTime;
    } else {
      return '';
    }
  }

  beforeExit = source => {
    const { changed } = this.state;

    if (source === 'editorStartMenu') {
      if (changed === true) {
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
      if (changed === true) {
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

  saveException = () => {
    const preCheck = this.checkBeforeSave();
    if (preCheck === true) {
      const promises = [];
      const {
        parentMutator: {
          query,
          periods,
          periodId,
        }
      } = this.props;
      const {
        editor,
        editor: {
          exceptionalIds,
          name,
          startTime,
          endTime,
          startDate,
          endDate,
          editorServicePoints,
          allDay,
          closed
        }
      } = this.state;

      if (exceptionalIds === null || exceptionalIds === undefined) {
        for (let i = 0; i < editorServicePoints.length; i++) {
          if (editorServicePoints[i].selected === true) {
            query.replace(editorServicePoints[i].id);
            const exception = {
              servicePointId: editor.editorServicePoints[i].id,
              name,
              startDate,
              endDate,
              openingDays: [{
                openingDay: {
                  openingHour: [
                    {
                      startTime,
                      endTime,
                    }
                  ],
                  allDay: allDay === undefined ? false : allDay,
                  open: closed === undefined ? false : !closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                }
              }]
            };
            const createdPeriods = periods.POST(exception);
            promises.push(createdPeriods);
          }
        }
      } else if (exceptionalIds.length) {
        for (let i = 0; i < exceptionalIds.length; i++) {
          const chekedId = exceptionalIds[i].servicePointId;
          let action = 'POST';
          for (let j = 0; j < editorServicePoints.length; j++) {
            if (editorServicePoints[j].id === chekedId) {
              if (editorServicePoints[j].selected === false) {
                action = 'DELETE';
              } else {
                action = 'PUT';
              }
            }
          }
          const index = i;
          if (action === 'DELETE') {
            query.replace(exceptionalIds[index].servicePointId);
            periodId.replace(exceptionalIds[index].id);
            const modifyDelete = periods.DELETE(exceptionalIds[index].id);
            promises.push(modifyDelete);
          } else if (action === 'PUT') {
            query.replace(exceptionalIds[index].servicePointId);
            periodId.replace(exceptionalIds[index].id);
            const modifyExceptionPut = {
              id: exceptionalIds[index].id,
              servicePointId: exceptionalIds[index].servicePointId,
              name,
              startDate,
              endDate,
              openingDays: [{
                openingDay: {
                  openingHour: [
                    {
                      startTime,
                      endTime,
                    }
                  ],
                  allDay: allDay === undefined ? false : allDay,
                  open: closed === undefined ? false : !closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                }
              }]
            };
            const modifyPromisePut = periods.PUT(modifyExceptionPut);
            promises.push(modifyPromisePut);
          } else if (action === 'POST') {
            query.replace(exceptionalIds[index].servicePointId);
            const modifyExceptionPost = {
              servicePointId: exceptionalIds[index].servicePointId,
              name,
              startDate,
              endDate,
              openingDays: [{
                openingDay: {
                  openingHour: [
                    {
                      startTime,
                      endTime,
                    }
                  ],
                  allDay: allDay === undefined ? false : allDay,
                  open: closed === undefined ? false : !closed,    // form asked for closed tag but backed expect open so closed state store the velue for the backend
                }
              }]
            };
            const modifyPromisPost = periods.POST(modifyExceptionPost);
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

  deleteException = () => {
    const promises = [];
    const {
      parentMutator: {
        query,
        periodId,
        periods,
      }
    } = this.props;
    const {
      servicePoints,
      editor: {
        exceptionalIds,
      }
    } = this.state;

    for (let i = 0; i < exceptionalIds.length; i++) {
      query.replace(exceptionalIds[i].servicePointId);
      periodId.replace(exceptionalIds[i].id);
      const deletedPeriods = periods.DELETE(exceptionalIds[i].id);
      promises.push(deletedPeriods);
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
            this.setEvents(servicePoints);
          });
      });
  }

  closeErrorModal = () => {
    this.setState({
      errors: [],
    });
  }

  checkBeforeSave = () => {
    // return true ===  can save
    const {
      editor: {
        editorServicePoints,
        startDate,
        endDate,
        name,
        startTime,
        endTime,
      }
    } = this.state;
    let errorMessage = null;
    let isServicePointSelected = false;

    for (let i = 0; i < editorServicePoints.length; i++) {
      if (editorServicePoints[i].selected === true) {
        isServicePointSelected = true;
      }
    }
    if (startDate === null || startDate === undefined || startDate === '') {
      errorMessage = 'noStartDate';
    } else if (endDate === null || endDate === undefined || endDate === '') {
      errorMessage = 'noEndDate';
    } else if (moment(endDate)
      .toDate() < moment(startDate)
      .toDate()) {
      errorMessage = 'wrongStartEndDate';
    } else if (name === null || name === undefined) {
      errorMessage = 'noName';
    } else if (!isServicePointSelected) {
      errorMessage = 'noServicePointSelected';
    } else if (startTime === null || startTime === undefined || startTime === '') {
      errorMessage = 'noStartTime';
    } else if (endTime === null || endTime === undefined || endTime === '') {
      errorMessage = 'noEndTime';
    } else if (moment(endTime) < moment(startTime)) {
      errorMessage = 'endTimeBeforeStartTime';
    }
    if (errorMessage === null) {
      return true;
    } else {
      return errorMessage;
    }
  }

  render() {
    const {
      errors,
      editor,
      editor: {
        exceptionalIds,
        editorServicePoints,
        allSelector,
        closed,
        allDay,
      },
      modifyEvent,
      servicePoints,
      events,
      deleteQuestion,
      errorEditorClose,
      errorExceptionExit,
      openEditor,
    } = this.state;
    let name = '';

    if (editor !== null && editor !== undefined) {
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

    if (modifyEvent) {
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
      <Pane defaultWidth="20%" style={{ height: '100vh' }} paneTitle={<FormattedMessage id="ui-calendar.servicePoints" />}>
        <ServicePointSelector
          {...this.props}
          handleServicePointChange={this.handleServicePointChange}
          setServicePoints={this.setServicePoints}
          servicePoints={servicePoints}
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
          myEvents={events}
          getEvent={this.getEvent}
        />
      </Pane>;

    let editorPaneTittle = null;

    if (exceptionalIds !== null && exceptionalIds !== undefined) {
      editorPaneTittle = <FormattedMessage id="ui-calendar.editExceptionPeriod" />;
    } else {
      editorPaneTittle = <FormattedMessage id="ui-calendar.newExceptionPeriod" />;
    }

    const editorPane =
      <Pane
        defaultWidth="20%"
        style={{ height: '100vh' }}
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
          editorServicePoints={editorServicePoints}
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
          allSelector={allSelector}
          closed={closed}
          allDay={allDay}
          editor={editor}
          isModify={modifyEvent}
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
          buttonStyle="primary"
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
    if (deleteQuestion !== null && deleteQuestion !== undefined && deleteQuestion === true) {
      const text =
        <SafeHTMLMessage
          id="ui-calendar.deleteQuestionException"
          values={{ name }}
        />;
      deleteModal =
        <ConfirmationModal
          id="delete-confirmation"
          open={deleteQuestion}
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
    if (errorEditorClose === true) {
      errorCloseEditor =
        <ConfirmationModal
          id="exite-confirmation"
          open={errorEditorClose}
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
    if (errorExceptionExit === true) {
      errorExitException =
        <ConfirmationModal
          id="exite-confirmation"
          open={errorExceptionExit}
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
        {!openEditor && selectorPane}
        {calendarPane}
        {openEditor && editorPane}
      </Paneset>
    );
  }
}

export default ExceptionWrapper;
