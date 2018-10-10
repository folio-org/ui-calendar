import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import RandomColor from 'randomcolor';
import moment from 'moment';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import Button from '@folio/stripes-components/lib/Button';
import ServicePointSelector from './ServicePointSelector';
import ExceptionalPeriodEditor from './ExceptionalPeriodEditor';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css';
import {ConfirmationModal, Modal} from "@folio/stripes/components/index"; // eslint-disable-line

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
      this.setState({
        servicePoints: [],
        openEditor: null,
        deleteQuestion: null,
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
        }
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

    closeErrorModal() {
      this.setState({
        errorModalText: null,
      });
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
            if (action === 'DELETE') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[i].servicePointId);
              parentMutator.periodId.replace(chekedId);
              const a = this.props.parentMutator.periods.DELETE(chekedId);
              promises.push(a);
            } else if (action === 'PUT') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[i].id);
              const exception = {
                id: this.state.editor.exceptionalIds[i],
                servicePointId: editor.exceptionalIds[i].servicePointId,
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
              const a = this.props.parentMutator.periods.PUT(exception);
              promises.push(a);
            } else if (action === 'POST') {
              parentMutator.query.replace(this.state.editor.exceptionalIds[i].id);
              const exception = {
                servicePointId: editor.exceptionalIds[i].servicePointId,
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
        }
        Promise.all(promises).then(() => {
          this.setState({
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
        });
      } else {
        this.setState({
          errorModalText: preCheck,
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
      Promise.all(promises).then(() => {
        this.setState({
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
      });
    }

    componentWillMount() {      // eslint-disable-line react/no-deprecated
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];
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
      });
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
      if (e === false || e === undefined) {
        tempEditor.allDay = true;
        tempEditor.startTime = '00:00';
        tempEditor.endTime = '23:59';
        this.setState({
          editor: tempEditor,
        });
      } else {
        tempEditor.allDay = false;
        tempEditor.startTime = '00:00';
        tempEditor.endTime = '00:00';
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

    setStartTime(e) {
      const tempEditor = this.state.editor;
      tempEditor.startTime = e;
      this.setState({
        editor: tempEditor,
      });
    }

    setEndTime(e) {
      const tempEditor = this.state.editor;
      tempEditor.endTime = e;
      this.setState({
        editor: tempEditor
      });
    }

    setting(sps) {
      const events = [];
      let k = 0;
      let color = 'black';
      for (let i = 0; i < this.props.periods.length; i++) {
        for (let j = 0; j < sps.length; j++) {
          if (sps[j].id === this.props.periods[i].servicePointId && sps[j].selected === true) {
            const event = {};
            event.start = this.props.periods[i].startDate;
            event.end = this.props.periods[i].endDate;
            event.id = this.props.periods[i].id;
            event.openingDays = this.props.periods[i].openingDays;

            if (this.state.servicePoints) {
              for (let l = 0; l < this.state.servicePoints.length; l++) {
                if (this.state.servicePoints[l].id === this.props.periods[i].servicePointId) {
                  color = this.state.servicePoints[l].color;
                }
              }
            }

            event.color = color;
            const sepEvent = this.separateEvents(event);

            for (let g = 0; g < sepEvent.length; g++) {
              events[k] = sepEvent[g];
              k++;
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
    }

    separateEvents(event) {
      const temp = [];
      let g = 0;
      for (let i = 0; i < moment(event.end).diff(moment(event.start), 'days') + 1; i++) {
        const today = moment(event.start).add(i, 'days').format('dddd').toUpperCase();

        const dates = [];

        for (let j = 0; j < event.openingDays.length; j++) {
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
          const eventContent = <div className="rbc-event-dates-content">{dates}</div>;
          const eventTitle =
            <div className="rbc-event-dates" style={{ backgroundColor: event.color, border: '5px red' }}>
              {' '}
              {eventContent}
            </div>;

          const tempObj = {
            id: event.id,
            end: moment(event.start).add(i, 'days'),
            start: moment(event.start).add(i, 'days'),
            title: eventTitle,

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

    handleDeletequestion(boolean) {
      this.setState({
        deleteQuestion: boolean,
      });
    }

    render() {
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
            onClick={this.deleteException}
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
            servicePoints={this.state.editor.editorServicePoints}
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
        const confirmationMessageDelete = 'ui-calendar.' + this.state.errorModalText;
        deleteModal =
          <ConfirmationModal
            id="delete-confirmation"
            open={this.state.deleteQuestion}
            heading={CalendarUtils.translateToString('ui-calendar.deleteQuestionExceptionTitle', this.props.stripes.intl)}
            message={CalendarUtils.translateToString('ui-calendar.deleteQuestionException', this.props.stripes.intl)}
            onConfirm={() => {
                    this.deleteException();
                }}
            onCancel={() => {
                    this.setState({ deleteQuestion: false });
                }}
            confirmLabel={CalendarUtils.translateToString('ui-calendar.deleteButton', this.props.stripes.intl)}
          />;
      }

      return (
        <Paneset>
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
