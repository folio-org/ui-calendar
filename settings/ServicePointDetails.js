import React from 'react';
import PropTypes from 'prop-types';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Headline from '@folio/stripes-components/lib/Headline/Headline';
import moment from 'moment';
import BigCalendar from '@folio/react-big-calendar/src';
import List from '@folio/stripes-components/lib/List/List';
import Button from '@folio/stripes-components/lib/Button/Button';
import Icon from '@folio/stripes-components/lib/Icon/Icon';
import { Layer } from '@folio/stripes-components';
import OpeningPeriodFormWrapper from './OpeningPeriodForm/OpeningPeriodFormWrapper';
import ErrorBoundary from '../ErrorBoundary';
import CalendarUtils from '../CalendarUtils';
import ExceptionWrapper from './OpenExceptionalForm/ExceptionWrapper';

class ServicePointDetails extends React.Component {
  constructor() {
    super();
    this.getWeekdayOpeningHours = this.getWeekdayOpeningHours.bind(this);
    this.displayCurrentPeriod = this.displayCurrentPeriod.bind(this);
    this.displayNextPeriod = this.displayNextPeriod.bind(this);
    this.onOpenCloneSettings = this.onOpenCloneSettings.bind(this);
    this.onSuccessfulCreatePeriod = this.onSuccessfulCreatePeriod.bind(this);
    this.onSuccessfulModifyPeriod = this.onSuccessfulModifyPeriod.bind(this);
    this.clickNewPeriod = this.clickNewPeriod.bind(this);
    this.onClose = this.onClose.bind(this);
    this.getServicePoints = this.getServicePoints.bind(this);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
    this.getLatestPeriod = this.getLatestPeriod.bind(this);
    this.getAllServicePoints = this.getAllServicePoints.bind(this);
    this.state = {
      newPeriodLayer: {
        isOpen: false,
      },
      modifyPeriodLayer: {
        isOpen: false,
      },
      openExceptions: {
        isOpen: false,
      },
      modifyPeriod: {},
      openingPeriods: [],
      openingAllPeriods: [],
      nextPeriods: [],
      isPeriodsPending: true,
      isPeriodssending: true
    };
  }

  componentDidMount() {
    this.getServicePoints();
    this.getAllServicePoints();
  }


  getServicePoints() {
    this.props.parentMutator.query.replace(this.props.initialValues.id);
    this.props.parentMutator.periods.GET()
      .then((openingPeriods) => {
        console.log(openingPeriods);
        this.setState({ openingPeriods });
        this.setState({ currentPeriod: this.displayCurrentPeriod() });
        this.setState({ nextPeriods: this.displayNextPeriod() });
        this.setState({ isPeriodsPending: false });
      }, (error) => {
        return error;
      });
  }

  getAllServicePoints() {
    const openings = [{
      startDate: undefined,
      endDate: undefined,
      id: undefined,
      name: undefined,
      openingDays: undefined,
      servicePointId: undefined,
    }];
    const promises = [];
    this.props.parentMutator.query.replace('3a40852d-49fd-4df2-a1f9-6e2641a6e91f');
    const a = this.props.parentMutator.periods.GET();
    promises.push(a);
    this.props.parentMutator.query.replace('c4c90014-c8c9-4ade-8f24-b5e313319f4b');
    const b = this.props.parentMutator.periods.GET();
    promises.push(b);

    Promise.all(promises).then((openingAllPeriods) => {

      console.log('res');
      console.log(openingAllPeriods);

      this.setState({
        openingAllPeriods: [
          ...this.state.openingPeriods,
          { startDate: openingAllPeriods[0].startDate,
            endDate: openingAllPeriods[0].endDate,
            id: openingAllPeriods[0].id,
            name: openingAllPeriods[0].name,
            openingDays: openingAllPeriods[0].openingDays,
            servicePointId: openingAllPeriods[0].servicePointId }
        ]
      });
    });

    // ()
    //   .then((openingAllPeriods) => {
    //     const tempStart = openingAllPeriodsee[0].startDate;
    //     const tempEnd = openingAllPeriodsee[0].endDate;
    //     const tempId = openingAllPeriodsee[0].id;
    //     const tempName = openingAllPeriodsee[0].name;
    //     const tempOpeningDays = openingAllPeriodsee[0].openingDays;
    //     const tempServicePointId = openingAllPeriodsee[0].servicePointId;
    //
    //     this.setState({
    //       openingAllPeriods: [
    //         ...this.state.openingPeriods,
    //         { startDate: tempStart,
    //           endDate: tempEnd,
    //           id: tempId,
    //           name: tempName,
    //           openingDays: tempOpeningDays,
    //           servicePointId: tempServicePointId }
    //       ]
    //     });
    //   }, (error) => {
    //     console.log(error);
    //   });
    //
    //
    // this.props.parentMutator.query.replace('c4c90014-c8c9-4ade-8f24-b5e313319f4b');
    // this.props.parentMutator.periods.GET()
    //   .then((openingAllPeriods) => {
    //     const tempStart = openingAllPeriods[0].startDate;
    //     const tempEnd = openingAllPeriods[0].endDate;
    //     const tempId = openingAllPeriods[0].id;
    //     const tempName = openingAllPeriods[0].name;
    //     const tempOpeningDays = openingAllPeriods[0].openingDays;
    //     const tempServicePointId = openingAllPeriods[0].servicePointId;
    //
    //     this.setState({
    //       openingAllPeriods: [
    //         ...this.state.openingPeriods,
    //         { startDate: tempStart,
    //           endDate: tempEnd,
    //           id: tempId,
    //           name: tempName,
    //           openingDays: tempOpeningDays,
    //           servicePointId: tempServicePointId }
    //       ]
    //     });
    //   }, (error) => {
    //     console.log(error);
    //   });
  }


  getWeekdayOpeningHours(weekday) {
    const openingPeriod = this.state.currentPeriod;
    let periodTime = '';
    for (let i = 0; i < openingPeriod.openingDays.length; i++) {
      const days = openingPeriod.openingDays[i];
      const weekdays = days.weekdays.day;
      const day = days.openingDay;
      if (weekdays === weekday) {
        if (day.open) {
          if (day.allDay) {
            return 'All day';
          } else {
            for (let k = 0; k < day.openingHour.length; k++) {
              const hour = day.openingHour[k];
              const t1 = moment(hour.startTime, 'HH:mm');
              const t2 = moment(hour.endTime, 'HH:mm');
              periodTime += t1.format('HH:    mm') + ' - ' + t2.format('HH:mm') + ' \n';
            }
            return periodTime;
          }
        } else {
          return 'Closed';
        }
      }
    }
    return 'Closed';
  }

  displayCurrentPeriod() {
    let res;
    for (let index = 0; index < this.state.openingPeriods.length; index++) {
      const openingPeriod = this.state.openingPeriods[index];
      const start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
      const end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
      if (moment() > start && moment() < end) {
        res = {
          startDate: start.format(CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)),
          endDate: end.format(CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)),
          name: openingPeriod.name,
          openingDays: openingPeriod.openingDays,
          id: openingPeriod.id
        };
      }
    }
    return res;
  }

  displayNextPeriod() {
    const displayPeriods = [];
    for (let index = 0; index < this.state.openingPeriods.length; index++) {
      const openingPeriod = this.state.openingPeriods[index];
      const start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
      const end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
      if (!(moment() > start && moment() < end) && start > new Date()) {
        displayPeriods.push({
          id: openingPeriod.id,
          startDate: start.format(CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)),
          endDate: end.format(CalendarUtils.translateToString('ui-calendar.dateFormat', this.props.stripes.intl)),
          name: openingPeriod.name
        });
      }
    }
    return displayPeriods;
  }

  getLatestPeriod() {
    let latestEvent = moment().format('L');

    if (this.state.nextPeriods.length !== 0) {
      for (let i = 0; i < this.state.nextPeriods.length; i++) {
        if (this.state.nextPeriods[i].endDate > latestEvent) {
          latestEvent = this.state.nextPeriods[i].endDate;
        }
      }
    } else if (this.state.currentPeriod !== undefined) {
      latestEvent = this.state.currentPeriod.endDate;
    }

    return latestEvent;
  }

  onOpenCloneSettings() {
    this.props.onToggle(true);
  }

  clickNewPeriod() {
    this.setState({ newPeriodLayer: { isOpen: true } });
  }

  onSuccessfulCreatePeriod() {
    this.setState({ newPeriodLayer: { isOpen: false } });
    this.getServicePoints();
  }

  onSuccessfulModifyPeriod() {
    this.setState({ modifyPeriodLayer: { isOpen: false } });
    this.getServicePoints();
  }

  onClose() {
    this.setState({ newPeriodLayer: { isOpen: false } });
    this.setState({ modifyPeriodLayer: { isOpen: false } });
    this.setState({ openExceptions: { isOpen: false } });
  }

  handleSelectPeriod(id) {
    for (let i = 0; i < this.state.openingPeriods.length; i++) {
      const period = this.state.openingPeriods[i];
      if (period.id === id) {
        this.setState({ modifyPeriod: { period } });
        break;
      }
    }
    this.setState({ modifyPeriodLayer: { isOpen: true } });
  }

  clickOpenExeptions() {
    this.setState({ openExceptions: { isOpen: true } });
  }

  render() {
    let currentP;
    let currentPTimes;
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (this.state.currentPeriod) {
      currentP =
        <KeyValue
          label="Current:"
          value={
            <div
              className="periods"
              onClick={() => { this.handleSelectPeriod(this.state.currentPeriod.id); }}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              {this.state.currentPeriod.startDate + ' - ' + this.state.currentPeriod.endDate + ' (' + this.state.currentPeriod.name + ')'}
            </div>}
        />;

      currentPTimes =
        <Row>
          <Col xs>
            <div className="seven-cols">
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.sunDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[0])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.monDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[1])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.tueDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[2])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.wedDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[3])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.thuDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[4])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.friDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[5])}
                />
              </div>
              <div className="col-sm-1">
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.satDayShort')}
                  value={this.getWeekdayOpeningHours(weekdays[6])}
                />
              </div>
            </div>
          </Col>
        </Row>;
    }
    let nextPeriodDetails;
    const itemFormatter = (item) => (
      <li>
        <div
          className="periods"
          onClick={() => { this.handleSelectPeriod(item.id); }}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          key={item.id}
        >
          {item.startDate + ' - ' + item.endDate + ' (' + item.name + ')'}
        </div>
      </li>);
    if (this.state.nextPeriods && this.state.nextPeriods.length > 0) {
      nextPeriodDetails =
        <Row>
          <Col xs>
            <Headline
              size="small"
              margin="large"
            >
              {CalendarUtils.translate('ui-calendar.nextPeriod')}
            </Headline>
            <List
              items={this.state.nextPeriods}
              itemFormatter={itemFormatter}
            />
          </Col>
        </Row>;
    }
    BigCalendar.momentLocalizer(moment);
    const servicePoint = this.props.initialValues;

    if (!this.state.isPeriodsPending && !this.state.isPeriodsPending) {
      return (

        <ErrorBoundary>

          {console.log('mostmár jo lesz :) ')}
          {console.log(this.state)}
          <div>
            <Row>
              <Col xs>
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.name')}
                  value={servicePoint.name}
                />
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.code')}
                  value={servicePoint.code}
                />
                <KeyValue
                  label={CalendarUtils.translate('ui-calendar.settings.locations.discoveryDisplayName')}
                  value={servicePoint.discoveryDisplayName}
                />
                <Headline
                  size="small"
                  margin="large"
                >
                  {CalendarUtils.translate('ui-calendar.regularLibraryHours')}
                </Headline>
                {currentP}

              </Col>
            </Row>
            {currentPTimes}
            {nextPeriodDetails}
            <Row>
              <Col xs={4}>
                <Button onClick={() => this.clickNewPeriod()}>
                  {CalendarUtils.translate('ui-calendar.newButton')}
                </Button>
              </Col>
              <Col xs={6}>
                <Button disabled>
                  {CalendarUtils.translate('ui-calendar.cloneSettings')}
                </Button>
              </Col>
            </Row>
            <Row>

              <Col xs>
                <Headline
                  size="small"
                  margin="large"
                >
                  {CalendarUtils.translate('ui-calendar.actualLibraryHours')}
                </Headline>

                <p>{CalendarUtils.translate('ui-calendar.regularOpeningHoursWithExceptions')}</p>
                <div className="add-exceptions-icon-wrapper">
                  <div className="icon-button">
                    <Icon
                      icon="calendar"
                      size="large"
                      iconClassName="calendar-icon"
                    />
                    <div className="icon-text" onClick={() => this.clickOpenExeptions()}> Open calendar</div>
                  </div>
                  <div className="text"> to add exceptions</div>
                </div>
              </Col>
            </Row>
          </div>

          <Layer
            isOpen={this.state.newPeriodLayer.isOpen}
            label={this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.editEntry' }, { entry: this.props.entryLabel })}
            container={document.getElementById('ModuleContainer')}
          >
            <OpeningPeriodFormWrapper
              {...this.props}
              onSuccessfulCreatePeriod={this.onSuccessfulCreatePeriod}
              onClose={this.onClose}
              servicePointId={servicePoint.id}
              latestEvent={this.getLatestPeriod()}
            />

          </Layer>

          <Layer
            isOpen={this.state.modifyPeriodLayer.isOpen}
            label={this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.editEntry' }, { entry: this.props.entryLabel })}
            container={document.getElementById('ModuleContainer')}
          >
            <OpeningPeriodFormWrapper
              {...this.props}
              modifyPeriod={this.state.modifyPeriod.period}
              onSuccessfulModifyPeriod={this.onSuccessfulModifyPeriod}
              onClose={this.onClose}
              servicePointId={servicePoint.id}
            />

          </Layer>
          <Layer
            isOpen={this.state.openExceptions.isOpen}
            label={this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.editEntry' }, { entry: this.props.entryLabel })}
            container={document.getElementById('ModuleContainer')}
          >

            <ExceptionWrapper
              {...this.props}
              entries={this.props.initialValues.allEntries}
              onClose={this.onClose}
              periods={this.state.openingAllPeriods}
              onSuccessfulModifyPeriod={this.onSuccessfulModifyPeriod}
            />

          </Layer>
        </ErrorBoundary>
      );
    } else {
      return (
        <div>
          <Icon
            icon="spinner-ellipsis"
            size="medium"
            iconClassName="spinner-ellipsis"
          />
        </div>
      );
    }
  }
}

ServicePointDetails.propTypes = {
  initialValues: PropTypes.object,
  stripes: PropTypes.shape({
    intl: PropTypes.object.isRequired,
    connect: PropTypes.func.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    periods: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    })
  }),
};


export default ServicePointDetails;
