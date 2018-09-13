import React from 'react';
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
            this.setState({startDate: moment(this.props.latestEvent).format()})
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
            open: false,
            errorModalText: null
        });
    }



    onFormSubmit(event) {
      event.preventDefault();
      const { parentMutator, servicePointId } = this.props;
      if (moment(this.state.startDate).toDate() > moment(this.state.endDate).toDate()) {
          console.log('TODO ROSSZ DATE VAN MEGADVA');
          this.setState({
              errorModalText: "TODO ROSSZ DATE VAN MEGADVA",
              open: true
          });
          this.render();
          return null;
      }
      if (this.state.event === null || this.state.event === undefined || this.state.event.length === 0) {
          console.log('TODO NINCSEN ENVENT');
          this.setState({
              errorModalText: "TODO NINCSEN ENVENT",
              open: true
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
        if(this.props.modifyPeriod){
            if (servicePointId) parentMutator.query.replace(servicePointId);
            if (servicePointId) parentMutator.periodId.replace(this.props.modifyPeriod.id);
            period.id=this.props.modifyPeriod.id;
            delete period.events;
            return parentMutator.periods.PUT(period).then((e) => {
                that.props.onSuccessfulModifyPeriod(e);
            }, (error) => {
                console.log(error);
            });
        }
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
      return parentMutator.periods.POST(period).then((e) => {
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
      let open = false;
      if(this.state.errorModalText !== null && this.state.errorModalText !== undefined) {
          errorModal =
              <Modal onClose={this.closeErrorModal} open label={this.state.errorModalText}>
                  <button onClick={this.closeErrorModal}>Close modal</button>
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
                    />

                    />

                    <BigCalendarHeader {...this.props} />
                    {modifyPeriod}
                </form>
            </div>
        );
    }
}

export default stripesForm({
  form: 'OpeningPeriodFormWrapper',
})(OpeningPeriodFormWrapper);

