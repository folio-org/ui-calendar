import {cloneDeep} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Headline from "../../stripes-components/lib/Headline/Headline";
import Paneset from "../../stripes-components/lib/Paneset/Paneset";
import Pane from "../../stripes-components/lib/Pane/Pane";
import moment from 'moment';
import BigCalendar from "../../react-big-calendar/src";
import List from "../../stripes-components/lib/List/List";
import Button from "../../stripes-components/lib/Button/Button";
import Icon from "../../stripes-components/lib/Icon/Icon";
import CloneSettings from "./CloneSettings";
import Checkbox from "../../stripes-components/lib/Checkbox";
import EntryManager from "../../stripes-smart-components/lib/EntryManager/EntryManager";
import {Layer} from "../../stripes-components";
import Route from "react-router-dom/es/Route";
import OpeningPeriodForm from "./OpeningPeriodForm"
import Switch from "react-router-dom/es/Switch";
import Instances from "../../ui-inventory/Instances";
import EntryForm from "../../stripes-smart-components/lib/EntryManager/EntryForm";
import Callout from "@folio/stripes-components/lib/Callout/Callout";
import ErrorBoundary from "../ErrorBoundary";

class ServicePointDetails extends React.Component {
    static propTypes = {
        stripes: PropTypes.shape({
            connect: PropTypes.func.isRequired,
            intl: PropTypes.object.isRequired,
        }).isRequired,
        initialValues: PropTypes.object,
    };

    constructor(props) {
        super();
        this.getWeekdayOpeningHours = this.getWeekdayOpeningHours.bind(this);
        this.displayCurrentPeriod = this.displayCurrentPeriod.bind(this);
        this.displayNextPeriod = this.displayNextPeriod.bind(this);
        this.onOpenCloneSettings = this.onOpenCloneSettings.bind(this);
        // this.clickNewPeriod = this.clickNewPeriod.bind(this);
        this.state = {
            newPeriodLayer: {
                isOpen: false,
            },
            sections: {
                generalInformation: true,
            },
            displayCurrentPeriod: {},
            displayPeriods: [],
            openingPeriod: {
                id: '1',
                servicePointId: '2',
                name: 'Tets period',
                startDate: '2018-06-01',
                endDate: '2018-06-30',
                openingDays: [
                    {
                        day: "MONDAY",
                        open: false, allDay: false
                    }, {
                        day: "TUESDAY",
                        open: true,
                        allDay: true
                    }, {
                        day: "WEDNESDAY",
                        open: true,
                        allDay: false,
                        openingHour: [{
                            endTime: "19:45:18.000Z",
                            startTime: "19:16:18.000Z"
                        }, {
                            endTime: "19:14:25.000Z",
                            startTime: "19:00:25.000Z"
                        }, {
                            endTime: "10:02:31.000Z",
                            startTime: "9:02:31.000Z"
                        }]
                    }, {day: "THURSDAY", open: false, allDay: false}, {
                        day: "FRIDAY",
                        open: true,
                        allDay: false,
                        openingHour: [{
                            endTime: "16:19:20.000Z",
                            startTime: "12:00:20.000Z"
                        }]
                    }, {
                        day: "SATURDAY",
                        open: false,
                        allDay: false
                    }, {
                        day: "SUNDAY",
                        open: false,
                        allDay: false
                    }]
            },
            openingPeriods: [
                {
                    id: '1',
                    servicePointId: '2',
                    name: 'Tets period',
                    startDate: '2018-06-01',
                    endDate: '2018-06-30',
                    openingDays: [
                        {
                            day: "MONDAY",
                            open: false, allDay: false
                        }, {
                            day: "TUESDAY",
                            open: true,
                            allDay: true
                        }, {
                            day: "WEDNESDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "19:45:18.000Z",
                                startTime: "19:16:18.000Z"
                            }, {
                                endTime: "19:14:25.000Z",
                                startTime: "19:00:25.000Z"
                            }, {
                                endTime: "10:02:31.000Z",
                                startTime: "9:02:31.000Z"
                            }]
                        }, {day: "THURSDAY", open: false, allDay: false}, {
                            day: "FRIDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "16:19:20.000Z",
                                startTime: "12:00:20.000Z"
                            }]
                        }, {
                            day: "SATURDAY",
                            open: false,
                            allDay: false
                        }, {
                            day: "SUNDAY",
                            open: false,
                            allDay: false
                        }]
                }, {
                    id: '2',
                    servicePointId: '2',
                    name: 'Test period 2',
                    startDate: '2018-07-01',
                    endDate: '2018-07-30',
                    openingDays: [
                        {
                            day: "MONDAY",
                            open: false, allDay: false
                        }, {
                            day: "TUESDAY",
                            open: true,
                            allDay: true
                        }, {
                            day: "WEDNESDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "19:45:18.000Z",
                                startTime: "19:16:18.000Z"
                            }, {
                                endTime: "19:14:25.000Z",
                                startTime: "19:00:25.000Z"
                            }, {
                                endTime: "10:02:31.000Z",
                                startTime: "9:02:31.000Z"
                            }]
                        }, {day: "THURSDAY", open: false, allDay: false}, {
                            day: "FRIDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "16:19:20.000Z",
                                startTime: "12:00:20.000Z"
                            }]
                        }, {
                            day: "SATURDAY",
                            open: false,
                            allDay: false
                        }, {
                            day: "SUNDAY",
                            open: false,
                            allDay: false
                        }]
                }, {
                    id: '3',
                    servicePointId: '2',
                    name: 'Tets period 3',
                    startDate: '2018-08-01',
                    endDate: '2018-08-30',
                    openingDays: [
                        {
                            day: "MONDAY",
                            open: false, allDay: false
                        }, {
                            day: "TUESDAY",
                            open: true,
                            allDay: true
                        }, {
                            day: "WEDNESDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "19:45:18.000Z",
                                startTime: "19:16:18.000Z"
                            }, {
                                endTime: "19:14:25.000Z",
                                startTime: "19:00:25.000Z"
                            }, {
                                endTime: "10:02:31.000Z",
                                startTime: "9:02:31.000Z"
                            }]
                        }, {day: "THURSDAY", open: false, allDay: false}, {
                            day: "FRIDAY",
                            open: true,
                            allDay: false,
                            openingHour: [{
                                endTime: "16:19:20.000Z",
                                startTime: "12:00:20.000Z"
                            }]
                        }, {
                            day: "SATURDAY",
                            open: false,
                            allDay: false
                        }, {
                            day: "SUNDAY",
                            open: false,
                            allDay: false
                        }]
                }
            ],
            selectedPeriods: [],
            selectedServicePoints: [],
        };
    }

    static manifest = Object.freeze({
        entries: {
            type: 'okapi',
            records: 'servicepoints',
            path: 'service-points',
        }
    });

    translateOrganization(id) {
        return this.props.stripes.intl.formatMessage({
            id: `ui-organization.settings.servicePoints.${id}`
        });
    }

    getWeekdayOpeningHours(weekday) {
        for (let index = 0; index < this.state.openingPeriods.length; index++) {
            let openingPeriod = this.state.openingPeriods[index];
            let start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
            let end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
            if (moment() > start && moment() < end) {
                let periodTime = "";
                for (let i = 0; i < openingPeriod.openingDays.length; i++) {
                    let day = openingPeriod.openingDays[i];
                    if (day.day === weekday) {
                        if (day.open) {
                            if (day.allDay) {
                                return "All day";
                            } else {
                                for (let k = 0; k < day.openingHour.length; k++) {
                                    let hour = day.openingHour[k];
                                    let t1 = moment(hour.startTime, 'HH:mm');
                                    let t2 = moment(hour.endTime, 'HH:mm');
                                    periodTime += t1.format('HH:mm') + " - " + t2.format('HH:mm') + " \n";
                                }
                                return periodTime;
                            }
                        } else {
                            return "Closed";
                        }
                    }
                }
            }
        }
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
                    name: openingPeriod.name
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
            if (!(moment() > start && moment() < end)) {
                displayPeriods.push({
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
    // onCancel(e) {
    //     e.preventDefault();
    //     this.setState({newPeriodLayer: {isOpen: false}});
    // }
    //
    // onEdit(entry) {
    //     this.setState({selectedId: entry.id});
    //     this.showLayer('edit');
    // }
    //
    // onRemove(entry) {
    //     const rk = this.props.resourceKey ? this.props.resourceKey : 'entries';
    //     return this.props.parentMutator[rk].DELETE(entry).then(() => {
    //         this.showCallOutMessage(entry[this.props.nameKey]);
    //         this.hideLayer();
    //     });
    // }
    //
    // onSave(entry) {
    //     const action = (entry.id) ? 'PUT' : 'POST';
    //     const rk = this.props.resourceKey ? this.props.resourceKey : 'entries';
    //     return this.props.parentMutator[rk][action](entry)
    //         .then(() => this.hideLayer());
    // }
    //
    // onSelect(entry) {
    //     this.setState({selectedId: entry.id});
    // }
    //
    // hideLayer() {
    //     this.props.history.push(`${this.props.location.pathname}`);
    // }
    //
    // showCallOutMessage(name) {
    //     const message = (
    //         <SafeHTMLMessage
    //             id="stripes-core.successfullyDeleted"
    //             values={{
    //                 entry: this.props.entryLabel,
    //                 name: name || '',
    //             }}
    //         />
    //     );
    //
    //     this.callout.sendCallout({message});
    // }
    //
    // showLayer(name) {
    //     this.props.history.push(`${this.props.location.pathname}?layer=${name}`);
    // }


    render() {
        BigCalendar.momentLocalizer(moment);
        const servicePoint = this.props.initialValues;
        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const currentPeriod = this.displayCurrentPeriod();
        const nextPeriod = this.displayNextPeriod();
        const itemFormatter = (item) => (<li>{item.startDate + " - " + item.endDate + " (" + item.name + ")"}</li>);

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
                            <KeyValue label="Current:"
                                      value={currentPeriod.startDate + " - " + currentPeriod.endDate + " (" + currentPeriod.name + ")"}/>
                        </Col>
                    </Row>
                    <Row>
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
                    </Row>
                    <Row>
                        <Col xs>
                            <Headline size="small" margin="large">Next:</Headline>
                            <List
                                items={nextPeriod}
                                itemFormatter={itemFormatter}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            {/*<Button>*/}
                            <Button onClick={() => this.clickNewPeriod()}>
                                New
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button>
                                {/*<Button onClick={this.onButtonClickOpenCloneSettings()}>*/}
                                Clone Settings
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Headline size="small" margin="large">Actual Library Hours</Headline>
                        <p> Regular opening hours with exceptions
                            <Icon
                                icon="bookmark"
                                size="medium"
                                iconClassName="calendar"
                            /> Open calendar to add exceptions </p>
                    </Row>
                </div>
                <Layer isOpen={this.state.newPeriodLayer.isOpen}
                       label={this.props.stripes.intl.formatMessage({id: 'stripes-core.label.editEntry'}, {entry: this.props.entryLabel})}
                       container={document.getElementById('ModuleContainer')}
                >
                    <OpeningPeriodForm
                        {...this.props}
                        // onCancel={this.onCancel}
                        initialValues={{}}
                        // onSave={this.onSave}
                        // onRemove={this.onRemove}
                        // onSubmit={this.onSave}
                        // validate={this.props.validate ? this.props.validate : () => ({})}
                        // asyncValidate={this.props.asyncValidate}
                        // deleteDisabled={this.props.deleteDisabled ? this.props.deleteDisabled : () => (false)}
                        // deleteDisabledMessage={this.props.deleteDisabledMessage || ''}
                    />

                </Layer>
                {/*<Callout ref={(ref) => {*/}
                    {/*this.callout = ref;*/}
                {/*}}/>*/}
            </ErrorBoundary>
        );

    }

}

export default ServicePointDetails;
