import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
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

import { permissions, moment } from '../constants';

class OpeningPeriodFormWrapper extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      confirmExit: false,
      dirty: false,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.props.modifyPeriod,
      dirty: false,
    });
  }

  confirmExit = () => {
    const { dirty } = this.state;

    if (!dirty) {
      this.props.onClose();
    } else {
      this.setState({
        confirmExit: true
      });
    }
  }

  confirmDelete = () => {
    this.setState({
      confirmDelete: true
    });
  }

  handleDateChange = (isStart, date) => {
    if (isStart) {
      this.setState({ startDate: date });
    } else {
      this.setState({ endDate: date });
    }
    this.setState({ dirty: true });
  }

  handleNameChange = name => {
    this.setState({
      name,
      dirty: true,
    });
  }

  onCalendarChange = event => {
    this.setState({
      event,
      dirty: true,
    });
  }

  handleDelete = () => {
    const parentMutator = this.props.parentMutator;
    const periodId = this.props.modifyPeriod.id;
    const servicePointId = this.props.modifyPeriod.servicePointId;

    if (servicePointId) parentMutator.query.replace(servicePointId);
    if (periodId) parentMutator.periodId.replace(periodId);

    return this.props.parentMutator.periods.DELETE(periodId)
      .then(e => {
        this.props.onSuccessfulModifyPeriod(e);
      });
  }

  closeErrorModal = () => {
    this.setState({
      errorModalText: null
    });
  }

  catchOverlappedEvents = async err => {
    if (err.status === 422) {
      const response = await err.json();
      const errorMessage = response.errors[0].message;

      this.setState({
        errorModalText: errorMessage,
      });
    }
  };

  createUpdatePeriod = (period, method) => {
    const { parentMutator } = this.props;
    const event = method === 'POST'
      ? parentMutator.periods.POST(period)
        .then(e => this.props.onSuccessfulCreatePeriod(e))
      : parentMutator.periods.PUT(period)
        .then(e => this.props.onSuccessfulModifyPeriod(e));

    event.catch(err => {
      this.catchOverlappedEvents(err);
    });

    return event;
  };

  onFormSubmit = e => {
    e.preventDefault();

    const {
      parentMutator,
      servicePointId,
      modifyPeriod,
    } = this.props;
    const {
      startDate,
      endDate,
      event,
      name,
    } = this.state;

    if ((moment(startDate).toDate() > moment(endDate).toDate()) || (moment(startDate).toDate() === moment(endDate).toDate())) {
      this.setState({
        errorModalText: <FormattedMessage id="ui-calendar.wrongStartEndDate" />,
      });

      return null;
    }
    if (event === null || event === undefined || event.length === 0) {
      this.setState({
        errorModalText: <FormattedMessage id="ui-calendar.noEvents" />,
      });

      return null;
    }
    let period = {
      name,
      startDate,
      endDate,
      openingDays: [],
      servicePointId
    };

    period = CalendarUtils.convertNewPeriodToValidBackendPeriod(period, event);
    if (modifyPeriod) {
      if (servicePointId) parentMutator.query.replace(servicePointId);
      if (servicePointId) parentMutator.periodId.replace(modifyPeriod.id);
      period.id = modifyPeriod.id;
      delete period.events;

      return this.createUpdatePeriod(period, 'PUT');
    }
    if (servicePointId) parentMutator.query.replace(servicePointId);

    return this.createUpdatePeriod(period, 'POST');
  }

  onEventChange = e => {
    this.setState({
      event: e,
      dirty: true,
    });
  }

  getStartDate = () => {
    const { modifyPeriod } = this.props;
    let date = '';

    if (modifyPeriod) {
      date = modifyPeriod.startDate;
    }

    return date;
  }

  getEndDate = () => {
    const { modifyPeriod } = this.props;
    let date = '';

    if (modifyPeriod) {
      date = modifyPeriod.endDate;
    }

    return date;
  }

  getName = () => {
    const { modifyPeriod } = this.props;
    let name = '';

    if (modifyPeriod) {
      name = modifyPeriod.name;
    }

    return name;
  }

  render() {
    let errorModal;
    const {
      confirmDelete,
      confirmExit,
      name,
      errorModalText,
    } = this.state;

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
    if (errorModalText !== null && errorModalText !== undefined) {
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
            <p>{errorModalText}</p>
          </div>
        </Modal>;
    }

    const isPeriodFormNew = isEmpty(this.props.modifyPeriod);
    const [title, submitPermission] = isPeriodFormNew
      ? ['ui-calendar.regularLibraryValidityPeriod', permissions.POST]
      : ['ui-calendar.modifyRegularLibraryValidityPeriod', permissions.PUT];

    return (
      <form style={{ height: 'inherit' }} onSubmit={this.onFormSubmit}>
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
                nameValue={name || ''}
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
