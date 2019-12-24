import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { IfPermission } from '@folio/stripes-core';
import {
  Button,
  ConfirmationModal,
  IconButton,
  Modal,
  Pane,
  Paneset,
  PaneFooter,
} from '@folio/stripes/components';

import InputFields from './InputFields';
import BigCalendarWrapper from './BigCalendarWrapper';
import BigCalendarHeader from './BigCalendarHeader';
import CalendarUtils from '../../CalendarUtils';

import { permissions } from '../constants';

class OpeningPeriodFormWrapper extends React.Component {
  static propTypes = {
    modifyPeriod: PropTypes.object,
    onSuccessfulCreatePeriod: PropTypes.func,
    onSuccessfulModifyPeriod: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    servicePointId: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      period: PropTypes.shape({
        records: PropTypes.object
      }),
    }),
    mutator: PropTypes.shape({
      servicePointId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      period: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor() {
    super();
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.confirmExit = this.confirmExit.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.getStartDate = this.getStartDate.bind(this);
    this.getEndDate = this.getEndDate.bind(this);
    this.getName = this.getName.bind(this);
    this.state = {
      confirmDelete: false,
      confirmExit: false,
      dirty: false,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.props.modifyPeriod,
      dirty: false
    });
  }

  confirmExit() {
    if (this.state.dirty === undefined || this.state.dirty === null || this.state.dirty === false) {
      this.props.onClose();
    } else if (this.state.dirty === true) {
      this.setState({
        confirmExit: true
      });
    }
  }

  confirmDelete() {
    this.setState({
      confirmDelete: true
    });
  }

  handleDateChange(isStart, date) {
    if (isStart) {
      this.setState({ startDate: date });
    } else {
      this.setState({ endDate: date });
    }
    this.setState({ dirty: true });
  }

  handleNameChange(name) {
    this.setState({
      name,
      dirty: true,
    });
  }

  onCalendarChange(event) {
    this.setState({
      event,
      dirty: true,
    });
  }

  handleDelete() {
    const that = this;
    const parentMutator = this.props.parentMutator;
    const periodId = this.props.modifyPeriod.id;
    const servicePointId = this.props.modifyPeriod.servicePointId;
    if (servicePointId) parentMutator.query.replace(servicePointId);
    if (periodId) parentMutator.periodId.replace(periodId);
    return this.props.parentMutator.periods.DELETE(periodId).then((e) => {
      that.props.onSuccessfulModifyPeriod(e);
    });
  }

  closeErrorModal() {
    this.setState({
      errorModalText: null
    });
  }


  onFormSubmit(event) {
    event.preventDefault();
    const { parentMutator, servicePointId } = this.props;
    if ((moment(this.state.startDate).toDate() > moment(this.state.endDate).toDate()) || (moment(this.state.startDate).toDate() === moment(this.state.endDate).toDate())) {
      this.setState({
        errorModalText: <FormattedMessage id="ui-calendar.wrongStartEndDate" />,
      });
      this.render();
      return null;
    }
    if (this.state.event === null || this.state.event === undefined || this.state.event.length === 0) {
      this.setState({
        errorModalText: <FormattedMessage id="ui-calendar.noEvents" />,
      });
      this.render();
      return null;
    }
    let period = {
      name: this.state.name,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      openingDays: [],
      servicePointId
    };
    period = CalendarUtils.convertNewPeriodToValidBackendPeriod(period, this.state.event);
    const that = this;
    if (this.props.modifyPeriod) {
      if (servicePointId) parentMutator.query.replace(servicePointId);
      if (servicePointId) parentMutator.periodId.replace(this.props.modifyPeriod.id);
      period.id = this.props.modifyPeriod.id;
      delete period.events;
      return parentMutator.periods.PUT(period).then((e) => {
        that.props.onSuccessfulModifyPeriod(e);
      });
    }
    if (servicePointId) parentMutator.query.replace(servicePointId);
    return parentMutator.periods.POST(period).then((e) => {
      that.props.onSuccessfulCreatePeriod(e);
    });
  }

  onEventChange(e) {
    this.setState({
      event: e,
      dirty: true,
    });
  }

  getStartDate() {
    let date = '';
    if (this.props.modifyPeriod) {
      date = this.props.modifyPeriod.startDate;
    }

    return date;
  }

  getEndDate() {
    let date = '';
    if (this.props.modifyPeriod) {
      date = this.props.modifyPeriod.endDate;
    }
    return date;
  }

  getName() {
    let name = '';
    if (this.props.modifyPeriod) {
      name = this.props.modifyPeriod.name;
    }
    return name;
  }

  render() {
    let errorModal;
    const name = this.state.name;
    const { confirmDelete, confirmExit } = this.state;
    const confirmationMessageDelete = (
      <SafeHTMLMessage
        id="ui-calendar.deleteQuestionMessage"
        values={{ name }}
      />
    );
    const confirmationMessageExit = (
      <SafeHTMLMessage
        id="ui-calendar.exitQuestionMessage"
      />
    );

    const errorDelete =
      <ConfirmationModal
        id="delete-confirmation"
        open={confirmDelete}
        heading={<FormattedMessage id="ui-calendar.deleteQuestionTitle" />}
        message={confirmationMessageDelete}
        onConfirm={() => {
          this.handleDelete();
        }}
        onCancel={() => {
          this.setState({ confirmDelete: false });
        }}
        confirmLabel={<FormattedMessage id="ui-calendar.deleteButton" />}
      />;

    const errorExit =
      <ConfirmationModal
        id="exite-confirmation"
        open={confirmExit}
        heading={<FormattedMessage id="ui-calendar.exitQuestionTitle" />}
        message={confirmationMessageExit}
        onConfirm={() => {
          return this.props.onClose();
        }}
        onCancel={() => {
          this.setState({ confirmExit: false });
        }}
        confirmLabel={<FormattedMessage id="ui-calendar.exitWithoutSaving" />}
      />;
    if (this.state.errorModalText !== null && this.state.errorModalText !== undefined) {
      const footer = (
        <Fragment>
          <Button
            data-test-error-modal-close-button
            onClick={this.closeErrorModal}
            buttonStyle="primary"
          >
            <FormattedMessage id="ui-calendar.close" />
          </Button>
        </Fragment>
      );

      errorModal =
        <Modal
          id="error-modal"
          dismissible
          onClose={this.closeErrorModal}
          open
          label={<FormattedMessage id="ui-calendar.invalidData" />}
          footer={footer}
        >
          <div data-test-error-modal-content>
            <p>{this.state.errorModalText}</p>
          </div>
        </Modal>;
    }

    const isPeriodFormNew = isEmpty(this.props.modifyPeriod);
    const [title, submitPermission] = isPeriodFormNew
      ? ['ui-calendar.regularLibraryValidityPeriod', permissions.POST]
      : ['ui-calendar.modifyRegularLibraryValidityPeriod', permissions.PUT];

    return (
      <form onSubmit={this.onFormSubmit}>
        <Paneset isRoot>
          <Pane
            data-test-opening-period-form-header
            defaultWidth="100%"
            paneTitle={(
              <div data-test-title>
                <FormattedMessage id={title} />
              </div>
            )}
            firstMenu={(
              <div data-test-close-button>
                <IconButton
                  icon="times"
                  size="medium"
                  iconClassName="closeIcon"
                  onClick={this.confirmExit}
                />
              </div>
            )}
            footer={(
              <PaneFooter
                renderStart={(
                  <Button
                    marginBottom0
                    onClick={this.confirmExit}
                  >
                    <FormattedMessage id="ui-calendar.common.cancel" />
                  </Button>
                )}
                renderEnd={(
                  <React.Fragment>
                    <IfPermission perm={permissions.DELETE}>
                      <Button
                        data-test-delete-button
                        disabled={isPeriodFormNew}
                        buttonStyle="danger"
                        onClick={this.confirmDelete}
                      >
                        <FormattedMessage id="ui-calendar.deleteButton" />
                      </Button>
                    </IfPermission>
                    <IfPermission perm={submitPermission}>
                      <Button
                        data-test-save-button
                        type="submit"
                        buttonStyle="default"
                      >
                        <FormattedMessage id="ui-calendar.saveButton" />
                      </Button>
                    </IfPermission>
                  </React.Fragment>
                )}
              />
            )}
          >
            <div
              data-test-opening-period-form
              id="newPeriodForm"
            >
              {errorDelete}
              {errorExit}
              {errorModal}
              <InputFields
                {...this.props}
                nameValue={this.state.name || ''}
                onNameChange={this.handleNameChange}
                onDateChange={this.handleDateChange}
                initialValues={
                  {
                    item: {
                      startDate: this.getStartDate(),
                      endDate: this.getEndDate(),
                    },
                    periodName: this.getName()
                  }
                }
              />
              <BigCalendarHeader {...this.props} />
              <BigCalendarWrapper
                onCalendarChange={this.onCalendarChange}
                {...(this.props.modifyPeriod && {
                  eventsChange: this.onEventChange,
                  periodEvents: this.props.modifyPeriod.openingDays,
                })}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default OpeningPeriodFormWrapper;
