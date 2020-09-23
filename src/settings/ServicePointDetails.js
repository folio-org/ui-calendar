import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import {
  Button,
  Col,
  Headline,
  Icon,
  KeyValue,
  Layer,
  List,
  Row,
  IconButton,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes-core';
import OpeningPeriodFormWrapper from './OpeningPeriodForm/OpeningPeriodFormWrapper';
import ErrorBoundary from '../ErrorBoundary';
import ExceptionWrapper from './OpenExceptionalForm/ExceptionWrapper';
import {
  permissions,
  ALL_DAY,
} from './constants';

class ServicePointDetails extends React.Component {
  constructor(props) {
    super(props);
    this.getWeekdayOpeningHours = this.getWeekdayOpeningHours.bind(this);
    this.displayCurrentPeriod = this.displayCurrentPeriod.bind(this);
    this.displayNextPeriod = this.displayNextPeriod.bind(this);
    this.onOpenCloneSettings = this.onOpenCloneSettings.bind(this);
    this.onSuccessfulCreatePeriod = this.onSuccessfulCreatePeriod.bind(this);
    this.clickNewPeriod = this.clickNewPeriod.bind(this);
    this.onClose = this.onClose.bind(this);
    this.getServicePoints = this.getServicePoints.bind(this);
    this.handleSelectPeriod = this.handleSelectPeriod.bind(this);
    this.state = {
      newPeriodLayerIsOpen: false,
      modifyPeriodLayerIsOpen: false,
      openExceptionsIsOpen: false,
      modifyPeriod: {},
      openingPeriods: [],
      nextPeriods: [],
      isPeriodsPending: true,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getServicePoints();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getServicePoints() {
    const isMounted = this._isMounted;
    this.props.parentMutator.query.replace(this.props.initialValues.id);
    this.props.parentMutator.exceptional.replace('false');
    this.props.parentMutator.periods.GET()
      .then((openingPeriods) => {
        if (isMounted) {
          this.setState({ openingPeriods });
          this.setState({ currentPeriod: this.displayCurrentPeriod() });
          this.setState({ nextPeriods: this.displayNextPeriod() });
          this.setState({ isPeriodsPending: false });
        }
      }, (error) => {
        return error;
      });
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
            return ALL_DAY;
          } else {
            for (let k = 0; k < day.openingHour.length; k++) {
              const hour = day.openingHour[k];
              const t1 = moment(hour.startTime, 'HH:mm');
              const t2 = moment(hour.endTime, 'HH:mm');
              periodTime += t1.format('HH:mm') + ' - ' + t2.format('HH:mm') + ' \n';
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
    const {
      intl: {
        formatMessage,
      },
    } = this.props;

    let res;
    for (let index = 0; index < this.state.openingPeriods.length; index++) {
      const openingPeriod = this.state.openingPeriods[index];
      const start = moment.utc(openingPeriod.startDate);
      const end = moment.utc(openingPeriod.endDate);
      const now = moment.utc();

      if (now > start && now < end) {
        res = {
          startDate: start.format(formatMessage({ id: 'ui-calendar.dateFormat' })),
          endDate: end.format(formatMessage({ id: 'ui-calendar.dateFormat' })),
          name: openingPeriod.name,
          openingDays: openingPeriod.openingDays,
          id: openingPeriod.id
        };
      }
    }
    return res;
  }

  displayNextPeriod() {
    const {
      intl: {
        formatMessage,
      },
    } = this.props;

    const displayPeriods = [];
    for (let index = 0; index < this.state.openingPeriods.length; index++) {
      const openingPeriod = this.state.openingPeriods[index];
      const start = moment.utc(openingPeriod.startDate);
      const end = moment.utc(openingPeriod.endDate);
      const now = moment.utc();

      if (!(now > start && now < end) && start > new Date()) {
        displayPeriods.push({
          id: openingPeriod.id,
          startDate: start.format(formatMessage({ id: 'ui-calendar.dateFormat' })),
          endDate: end.format(formatMessage({ id: 'ui-calendar.dateFormat' })),
          name: openingPeriod.name
        });
      }
    }
    return displayPeriods;
  }

  onOpenCloneSettings() {
    this.props.onToggle(true);
  }

  clickNewPeriod() {
    this.setState({ newPeriodLayerIsOpen: true });
  }

  onSuccessfulCreatePeriod() {
    this.setState({ newPeriodLayerIsOpen: false });
    this.getServicePoints();
  }

  onSuccessfulModifyPeriod = () => {
    this.setState({ modifyPeriodLayerIsOpen: false });
    this.getServicePoints();
  };

  onClose() {
    this.setState({ newPeriodLayerIsOpen: false });
    this.setState({ modifyPeriodLayerIsOpen: false });
    this.setState({ openExceptionsIsOpen: false });
  }

  handleSelectPeriod(id) {
    for (let i = 0; i < this.state.openingPeriods.length; i++) {
      const period = this.state.openingPeriods[i];
      if (period.id === id) {
        this.setState({ modifyPeriod: { period } });
        break;
      }
    }
    this.setState({ modifyPeriodLayerIsOpen: true });
  }

  clickOpenExeptions = () => {
    this.setState({ openExceptionsIsOpen: true });
  };

  render() {
    const { intl } = this.props;
    const layerContentLabel = intl.formatMessage({ id: 'stripes-core.label.editEntry' });
    let currentP;
    let currentPTimes;
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (this.state.currentPeriod) {
      currentP =
        <div data-test-service-point-current-period>
          <KeyValue
            label={<FormattedMessage id="ui-calendar.current" />}
            value={
              <Row
                className="new-period"
                between="xs"
              >
                <Col
                  xs={11}
                  data-test-next-period-item-label
                >
                  {this.state.currentPeriod.startDate + ' - ' + this.state.currentPeriod.endDate + ' (' + this.state.currentPeriod.name + ')'}
                </Col>
                <Col xs={1}>
                  <IconButton
                    data-test-current-period-item-edit-button
                    onClick={() => { this.handleSelectPeriod(this.state.currentPeriod.id); }}
                    ariaLabel="edit period button"
                    icon="edit"
                  />
                </Col>
              </Row>
             }
          />
        </div>;

      currentPTimes =
        <Row>
          <Col xs>
            <div
              data-test-service-point-current-period-times
              className="seven-cols"
            >
              <div
                data-test-sunday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.sunDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[0])}
                />
              </div>
              <div
                data-test-monday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.monDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[1])}
                />
              </div>
              <div
                data-test-tuesday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.tueDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[2])}
                />
              </div>
              <div
                data-test-wednesday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.wedDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[3])}
                />
              </div>
              <div
                data-test-thursday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.thuDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[4])}
                />
              </div>
              <div
                data-test-friday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.friDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[5])}
                />
              </div>
              <div
                data-test-saturday
                className="col-sm-1"
              >
                <KeyValue
                  label={<FormattedMessage id="ui-calendar.satDayShort" />}
                  value={this.getWeekdayOpeningHours(weekdays[6])}
                />
              </div>
            </div>
          </Col>
        </Row>;
    }
    let nextPeriodDetails;
    const itemFormatter = (item) => (
      <li
        data-test-next-period-item
        key={item.id}
      >
        <Row
          className="new-period"
          between="xs"
        >
          <Col
            xs={11}
            data-test-next-period-item-label
          >
            {item.startDate + ' - ' + item.endDate + ' (' + item.name + ')'}
          </Col>
          <Col xs={1}>
            <IconButton
              data-test-next-period-item-edit-button
              onClick={() => { this.handleSelectPeriod(item.id); }}
              ariaLabel="edit period button"
              icon="edit"
            />
          </Col>
        </Row>
      </li>);

    if (this.state.nextPeriods && this.state.nextPeriods.length > 0) {
      nextPeriodDetails =
        <div data-test-service-point-next-period>
          <Row>
            <Col xs>
              <div data-test-next-period-header>
                <Headline
                  size="small"
                  margin="large"
                >
                  <FormattedMessage id="ui-calendar.nextPeriod" />
                </Headline>
              </div>
              <List
                items={this.state.nextPeriods}
                itemFormatter={itemFormatter}
              />
            </Col>
          </Row>
        </div>;
    }

    const servicePoint = this.props.initialValues;

    if (!this.state.isPeriodsPending) {
      return (
        <ErrorBoundary>
          <div>
            <Row>
              <Col xs>
                <div data-test-service-point-name>
                  <KeyValue
                    label={<FormattedMessage id="ui-calendar.name" />}
                    value={servicePoint.name}
                  />
                </div>
                <div data-test-service-point-code>
                  <KeyValue
                    label={<FormattedMessage id="ui-calendar.code" />}
                    value={servicePoint.code}
                  />
                </div>
                <div data-test-service-point-discovery-display-name>
                  <KeyValue
                    label={<FormattedMessage id="ui-calendar.settings.locations.discoveryDisplayName" />}
                    value={servicePoint.discoveryDisplayName}
                  />
                </div>
                <div data-test-service-point-regular-library-hours>
                  <Headline
                    size="small"
                    margin="large"
                  >
                    <FormattedMessage id="ui-calendar.regularLibraryHours" />
                  </Headline>
                </div>
                {currentP}

              </Col>
            </Row>
            {currentPTimes}
            {nextPeriodDetails}
            <Row>
              <IfPermission perm={permissions.POST}>
                <Col xs={4}>
                  <Button
                    data-test-new-period
                    onClick={this.clickNewPeriod}
                  >
                    <FormattedMessage id="ui-calendar.newButton" />
                  </Button>
                </Col>
              </IfPermission>
            </Row>
            <Row>
              <div data-test-actual-library-hours>
                <Col xs>
                  <div data-test-actual-library-hours-header>
                    <Headline
                      size="small"
                      margin="large"
                    >
                      <FormattedMessage id="ui-calendar.actualLibraryHours" />
                    </Headline>
                  </div>
                  <div data-test-regular-opening-hours-with-exceptions>
                    <p><FormattedMessage id="ui-calendar.regularOpeningHoursWithExceptions" /></p>
                  </div>
                  <div className="add-exceptions-icon-wrapper">
                    <div className="icon-button">
                      <Button
                        data-test-add-exeptions
                        onClick={this.clickOpenExeptions}
                      >
                        <Icon
                          icon="calendar"
                          size="medium"
                          iconClassName="calendar-icon"
                        />
                        <FormattedMessage id="ui-calendar.openCalendarExceptions" />
                      </Button>
                    </div>
                  </div>
                </Col>
              </div>
            </Row>
          </div>

          <Layer
            isOpen={this.state.newPeriodLayerIsOpen}
            contentLabel={layerContentLabel}
            container={document.getElementById('ModuleContainer')}
          >
            <OpeningPeriodFormWrapper
              {...this.props}
              onSuccessfulCreatePeriod={this.onSuccessfulCreatePeriod}
              onClose={this.onClose}
              servicePointId={servicePoint.id}
              newPeriod={this.state.newPeriodLayerIsOpen}
            />
          </Layer>

          <Layer
            isOpen={this.state.modifyPeriodLayerIsOpen}
            contentLabel={layerContentLabel}
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
            isOpen={this.state.openExceptionsIsOpen}
            contentLabel={layerContentLabel}
            container={document.getElementById('ModuleContainer')}
          >
            <div data-test-exceptional-form>
              <ExceptionWrapper
                {...this.props}
                entries={this.props.initialValues.allEntries}
                onClose={this.onClose}
              />
            </div>
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
  intl: PropTypes.object,
  resources: PropTypes.shape({
    periods: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    })
  }),
};


export default injectIntl(ServicePointDetails);
