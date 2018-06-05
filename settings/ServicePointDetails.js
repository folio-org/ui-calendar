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

class ServicePointDetails extends React.Component {
    static propTypes = {
        stripes: PropTypes.shape({
            connect: PropTypes.func.isRequired,
            intl: PropTypes.object.isRequired,
        }).isRequired,
        // mutator: PropTypes.shape({
        //     periods: PropTypes.shape({
        //         GET: PropTypes.func,
        //     }),
        // }).isRequired,
        initialValues: PropTypes.object,
    };

    constructor(props) {
        super();
        this.lofasz = this.lofasz.bind(this);
        this.lofaszkukuCurrent = this.lofaszkukuCurrent.bind(this);
        this.lofaszkukunext = this.lofaszkukunext.bind(this);
        this.state = {
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
            ]
        };
    }

    static manifest = Object.freeze({
        periods: {
            type: 'okapi',
            records: 'periods',
            path: 'service-points',
        },
    });

    translateOrganization(id) {
        return this.props.stripes.intl.formatMessage({
            id: `ui-organization.settings.servicePoints.${id}`
        });
    }

    lofasz(weekday) {
        for (let index = 0; index < this.state.openingPeriods.length; index++) {
            let openingPeriod = this.state.openingPeriods[index];
            let start = moment(openingPeriod.startDate, 'YYYY-MM-DD');
            let end = moment(openingPeriod.endDate, 'YYYY-MM-DD');
            if (moment() > start && moment() < end) {
                let lofasz = "";
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
                                    lofasz += t1.format('HH:mm') + " - " + t2.format('HH:mm') + " \n";
                                }
                                return lofasz;
                            }
                        } else {
                            return "Closed";
                        }
                    }
                }
            }
        }
    }

    lofaszkukuCurrent() {
        let displayCurrentPeriod;
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

    lofaszkukunext() {
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

    render() {


        BigCalendar.momentLocalizer(moment);

        const servicePoint = this.props.initialValues;
        const openingPeriod = this.state.openingPeriod;

        const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        // return(
        //     <Paneset >
        //         <Pane
        // padContent={false}
        //           id="pane-calendar"
        //           defaultWidth="fill"
        //           height="100%"
        //           fluidContentWidth
        //           paneTitle={"lofasz"}>
        //             lofasz
        //         </Pane>
        //     </Paneset>
        // )
        console.log(this.state.displayCurrentPeriod);
        console.log(this.state.displayPeriods);
        const lofasz = this.lofaszkukuCurrent();
        const nextlofasz = this.lofaszkukunext();

        const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];
        const itemFormatter = (item) => (<li>{item.startDate + " - " + item.endDate + " (" + item.name + ")"}</li>);


        return (
            <div>
                <Row>
                    <Col xs>
                        <KeyValue label={this.translateOrganization('name')} value={servicePoint.name}/>
                        <KeyValue label={this.translateOrganization('code')} value={servicePoint.code}/>
                        <KeyValue label={this.translateOrganization('discoveryDisplayName')}
                                  value={servicePoint.discoveryDisplayName}/>
                        <Headline size="small" margin="large">Regular Library Hours</Headline>
                        <KeyValue label="Current:"
                                  value={lofasz.startDate + " - " + lofasz.endDate + " (" + lofasz.name + ")"}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs>
                        <div className={"seven-cols"}>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Sun" value={this.lofasz(weekdays[0])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Mon" value={this.lofasz(weekdays[1])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Tue" value={this.lofasz(weekdays[2])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Wed" value={this.lofasz(weekdays[3])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Thu" value={this.lofasz(weekdays[4])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Fri" value={this.lofasz(weekdays[5])}/>
                            </div>
                            <div className={"col-sm-1"}>
                                <KeyValue label="Sat" value={this.lofasz(weekdays[6])}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs>
                        <Headline size="small" margin="large">Next:</Headline>
                        <List
                            items={nextlofasz}
                            itemFormatter={itemFormatter}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <Button>
                            New
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button>
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
        );

    }
}

export default ServicePointDetails;
