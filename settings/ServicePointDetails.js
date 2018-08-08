import {cloneDeep} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Headline from "@folio/stripes-components/lib/Headline/Headline";
import moment from 'moment';
import BigCalendar from "@folio/react-big-calendar/src";
import List from "../../stripes-components/lib/List/List";
import Button from "../../stripes-components/lib/Button/Button";
import Icon from "../../stripes-components/lib/Icon/Icon";
import {Layer} from "../../stripes-components";
import OpeningPeriodFormWrapper from "./OpeningPeriodForm/OpeningPeriodFormWrapper"
import ErrorBoundary from "../ErrorBoundary";

class ServicePointDetails extends React.Component {


    constructor() {
        super();
        this.getWeekdayOpeningHours = this.getWeekdayOpeningHours.bind(this);
        this.displayCurrentPeriod = this.displayCurrentPeriod.bind(this);
        this.displayNextPeriod = this.displayNextPeriod.bind(this);
        this.onOpenCloneSettings = this.onOpenCloneSettings.bind(this);
        this.onSuccessfulCreatePeriod = this.onSuccessfulCreatePeriod.bind(this);
        this.clickNewPeriod = this.clickNewPeriod.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSuccessfulCreatePeriod = this.onSuccessfulCreatePeriod.bind(this);
        this.getServicePoints = this.getServicePoints.bind(this);
        this.state = {
            newPeriodLayer: {
                isOpen: false,
            },
            sections: {
                generalInformation: true,
            },
            displayCurrentPeriod: {},
            displayPeriods: [],
            openingPeriods: [],
            nextPeriods: [],
            selectedPeriods: [],
            selectedServicePoints: [],
            isPeriodsPending: true
        };
    }

    componentDidMount() {
        this.getServicePoints();
    }

    getServicePoints() {
        this.props.parentMutator.query.replace(this.props.initialValues.id);
        this.props.parentMutator.periods.GET()
            .then((openingPeriods) => {
                this.setState({openingPeriods: openingPeriods});
                this.setState({currentPeriod: this.displayCurrentPeriod()});
                this.setState({nextPeriods: this.displayNextPeriod()});
                this.setState({isPeriodsPending: false});
            }, (error) => {
                console.log(error);
            });

    }

    translateOrganization(id) {
        return this.props.stripes.intl.formatMessage({
            id: `ui-organization.settings.servicePoints.${id}`
        });
    }

    getWeekdayOpeningHours(weekday) {
        let openingPeriod = this.state.currentPeriod;
        let periodTime = "";
        for (let i = 0; i < openingPeriod.openingDays.length; i++) {
            let days = openingPeriod.openingDays[i];
            let weekdays = days.weekdays.day;
            let day = days.openingDay;
            if (weekdays === weekday) {
                if (day.open) {
                    if (day.allDay) {
                        return "All day";
                    } else {
                        for (let k = 0; k < day.openingHour.length; k++) {
                            let hour = day.openingHour[k];
                            let t1 = moment(hour.startTime, 'HH:mm');
                            let t2 = moment(hour.endTime, 'HH:mm');
                            periodTime += t1.format('HH:    mm') + " - " + t2.format('HH:mm') + " \n";
                        }
                        return periodTime;
                    }
                } else {
                    return "Closed";
                }
            }
        }
        return "Closed";
    }

    displayCurrentPeriod() {
        for (let index = 0; index < this.state.openingPeriods.length; index++) {
            let openingPeriod = this.state.openingPeriods[index];
            let start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
            let end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
            if (moment() > start && moment() < end) {
                return {
                    startDate: start.format("YYYY/MM/DD"),
                    endDate: end.format("YYYY/MM/DD"),
                    name: openingPeriod.name,
                    openingDays: openingPeriod.openingDays
                };
            }
        }
    }

    displayNextPeriod() {
        let displayPeriods = [];
        for (let index = 0; index < this.state.openingPeriods.length; index++) {
            let openingPeriod = this.state.openingPeriods[index];
            let start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
            let end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
            if (!(moment() > start && moment() < end) && start > new Date()) {
                displayPeriods.push({
                    id: openingPeriod.id,
                    startDate: start.format("YYYY/MM/DD"),
                    endDate: end.format("YYYY/MM/DD"),
                    name: openingPeriod.name
                })
            }
        }
        return displayPeriods;
    }


    onOpenCloneSettings() {
        this.props.onToggle(true);
    }

    onAdd() {
        this.setState({selectedId: null});
        this.showLayer('add');
    }

    clickNewPeriod() {
        this.setState({newPeriodLayer: {isOpen: true}});
    }

    onSuccessfulCreatePeriod() {
        this.setState({newPeriodLayer: {isOpen: false}});
        this.getServicePoints();
    }

    onClose() {
        this.setState({newPeriodLayer: {isOpen: false}});
    }

    render() {
        let currentP;
        let currentPTimes;
        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        if (this.state.currentPeriod) {
            currentP = <KeyValue label="Current:"
                                 value={this.state.currentPeriod.startDate + " - " + this.state.currentPeriod.endDate + " (" + this.state.currentPeriod.name + ")"}/>;
            currentPTimes = <Row>
                <Col xs>
                    <div className={"seven-cols"}>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Sun" value={this.getWeekdayOpeningHours(weekdays[0])}/>
                        </div>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Mon" value={this.getWeekdayOpeningHours(weekdays[1])}/>
                        </div>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Tue" value={this.getWeekdayOpeningHours(weekdays[2])}/>
                        </div>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Wed" value={this.getWeekdayOpeningHours(weekdays[3])}/>
                        </div>
                        <div className={"col-sm-1"}>

                            <KeyValue label="Thu" value={this.getWeekdayOpeningHours(weekdays[4])}/>
                        </div>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Fri" value={this.getWeekdayOpeningHours(weekdays[5])}/>
                        </div>
                        <div className={"col-sm-1"}>
                            <KeyValue label="Sat" value={this.getWeekdayOpeningHours(weekdays[6])}/>
                        </div>
                    </div>
                </Col>
            </Row>;
        }
        let nextPeriodDetails;
        const itemFormatter = (item) => (
            <li key={item.id}>{item.startDate + " - " + item.endDate + " (" + item.name + ")"}</li>);
        if (this.state.nextPeriods && this.state.nextPeriods.length>0) {
            nextPeriodDetails = <Row>
                <Col xs>
                    <Headline size="small" margin="large">Next:</Headline>
                    <List
                        items={this.state.nextPeriods}
                        itemFormatter={itemFormatter}
                    />
                </Col>
            </Row>;
        }
        BigCalendar.momentLocalizer(moment);
        const servicePoint = this.props.initialValues;
        if (!this.state.isPeriodsPending) {
            return (
                <ErrorBoundary>
                    <div>
                        <Row>
                            <Col xs>
                                <KeyValue label={this.translateOrganization('name')} value={servicePoint.name}/>
                                <KeyValue label={this.translateOrganization('code')} value={servicePoint.code}/>
                                <KeyValue label={this.translateOrganization('discoveryDisplayName')}
                                          value={servicePoint.discoveryDisplayName}/>
                                <Headline size="small" margin="large">Regular Library Hours</Headline>
                                {currentP}
                            </Col>
                        </Row>
                        {currentPTimes}
                        {nextPeriodDetails}
                        <Row>
                            <Col xs={4}>
                                <Button onClick={() => this.clickNewPeriod()}>
                                    New Period
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button disabled>
                                    Clone Settings
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <Headline size="small" margin="large">Actual Library Hours</Headline>

                                <p> Regular opening hours with exceptions</p>
                                <div className="add-exceptions-icon-wrapper">
                                    <div className="icon-button">
                                        <Icon
                                            icon="calendar"
                                            size="large"
                                            iconClassName="calendar-icon"
                                        />
                                        <div className="icon-text"> Open calendar </div>
                                    </div>
                                    <div className="text"> to add exceptions</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Layer isOpen={this.state.newPeriodLayer.isOpen}
                           label={this.props.stripes.intl.formatMessage({id: 'stripes-core.label.editEntry'}, {entry: this.props.entryLabel})}
                           container={document.getElementById('ModuleContainer')}
                    >
                        <OpeningPeriodFormWrapper
                            {...this.props}
                            onSuccessfulCreatePeriod={this.onSuccessfulCreatePeriod}
                            onClose={this.onClose}
                            servicePointId={servicePoint.id}
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
            )
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