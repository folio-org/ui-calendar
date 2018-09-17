import React, { Fragment } from 'react';
import stripesForm from '@folio/stripes-form/index';
import FromHeader from './FromHeader';
import InputFields from './InputFields';
import BigCalendarWrapper from './BigCalendarWrapper';
import BigCalendarHeader from './BigCalendarHeader';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import CalendarUtils from '../../CalendarUtils';
import Modal from "../../../stripes-components/lib/Modal/Modal";
import Button from '@folio/stripes-components/lib/Button';


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
      stripes: PropTypes.shape({
        intl: PropTypes.object.isRequired,
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
      this.state = {};
    }


    componentDidMount() {
        this.setState({...this.props.modifyPeriod});

        if(this.props.latestEvent !== undefined && this.props.latestEvent !== null ){
            this.setState({startDate: moment(this.props.latestEvent).add(1, 'days').format()})
        }

    }

    handleDateChange(isStart, date) {
      if (isStart) {
        this.setState({ startDate: date });
      } else {
        this.setState({ endDate: date });
      }
    }

    handleNameChange(name) {
      this.setState({ name });
    }

    onCalendarChange(event) {
      this.setState({ event });
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
      }, (error) => {
        console.log(error);
      });
    }

    closeErrorModal(){
        this.setState({
            errorModalText: null
        });
    }



    onFormSubmit(event) {
        event.preventDefault();
        const {parentMutator, servicePointId} = this.props;
        if (moment(this.state.startDate).toDate() > moment(this.state.endDate).toDate()) {
            this.setState({
                errorModalText: CalendarUtils.translateToString('ui-calendar.wrongStartEndDate',this.props.stripes.intl),
            });
            this.render();
            return null;
        }
        if (this.state.event === null || this.state.event === undefined || this.state.event.length === 0) {
            this.setState({
                errorModalText: CalendarUtils.translateToString('ui-calendar.noEvents',this.props.stripes.intl),
            });
            this.render();
            return null;
        }
        let period = {
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            openingDays: [],
            servicePointId: servicePointId
        };
        period = CalendarUtils.convertNewPeriodToValidBackendPeriod(period, this.state.event);
        let that = this;
        if (this.props.modifyPeriod) {
            if (servicePointId) parentMutator.query.replace(servicePointId);
            if (servicePointId) parentMutator.periodId.replace(this.props.modifyPeriod.id);
            period.id = this.props.modifyPeriod.id;
            delete period.events;
            return parentMutator.periods.PUT(period).then((e) => {
                that.props.onSuccessfulModifyPeriod(e);
            }, (error) => {
                console.log(error);
            });
        }
        if (servicePointId) parentMutator.query.replace(servicePointId);
        return parentMutator.periods['POST'](period).then((e) => {
            that.props.onSuccessfulCreatePeriod(e);
        }, (error) => {
            console.log(error);
        });
    }

    onEventChange(e) {
      this.setState({ event: e });
    }


    render() {
      let modifyPeriod;
      let errorModal;
        let start='';
        let end='';

        if(this.props.modifyPeriod){
            start=moment(this.props.modifyPeriod.startDate).add(1, 'days').format('L');
            end=moment(this.props.modifyPeriod.endDate).add(1, 'days').format('L');
        }else {
            start=moment(this.props.latestEvent).add(1, 'days').format('L');
        }

      if(this.state.errorModalText !== null && this.state.errorModalText !== undefined) {
          const footer = (
              <Fragment>
                  <Button onClick={this.closeErrorModal} ButtonStyle="primary">{CalendarUtils.translateToString('ui-calendar.close',this.props.stripes.intl)}</Button>
              </Fragment>
          );

          errorModal =
              <Modal dismissible onClose={this.closeErrorModal} open label={CalendarUtils.translateToString('ui-calendar.invalidData',this.props.stripes.intl)} footer={footer}>
                  <p>{this.state.errorModalText}</p>
              </Modal>
      }
      if (this.props.modifyPeriod) {
        modifyPeriod =
          <BigCalendarWrapper
            eventsChange={this.onEventChange}
            periodEvents={this.props.modifyPeriod.openingDays}
            onCalendarChange={this.onCalendarChange}
          />;
      } else {
        modifyPeriod = <BigCalendarWrapper onCalendarChange={this.onCalendarChange} />;
      }
        return (
            <div id="newPeriodForm">
                {errorModal}
                <form onSubmit={this.onFormSubmit}>
                    <FromHeader
                        {...this.props}
                        handleDelete={this.handleDelete}
                        onClose={this.props.onClose}/>
                    <InputFields
                        {...this.props}
                        nameValue={this.state.name}
                        onNameChange={this.handleNameChange}
                        onDateChange={this.handleDateChange}
                        initialValues={
                            { item:
                                    {
                                        startDate:start,
                                        endDate:end,
                                    } }
                        }
                    />
                    <BigCalendarHeader {...this.props} />
                    {modifyPeriod}
                </form>
            </div>
        );
    }
}

export default OpeningPeriodFormWrapper;