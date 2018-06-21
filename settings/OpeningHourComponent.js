import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Timepicker from '@folio/stripes-components/lib/Timepicker';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

class OpeningHourComponent extends React.Component {
    static propTypes = {
        fields: PropTypes.object,
        dayField: PropTypes.shape({
            open: PropTypes.bool,
            allDay: PropTypes.bool,
            day: PropTypes.string,
        }),
    };

    render() {
        const newOpeningHour = {startTime: undefined, endTime: undefined};
        const {dayField} = this.props;
        const disableFields = !dayField.open || dayField.allDay;
        // ${dateFormat(checkinDate, "yyyy-mm-dd")}T${checkinTime}Z

        const field = this.props.dayField;
        const fields = this.props.dayField.openingHour;
        console.log(field);
        console.log(fields);

        return (
            <div>
                {(fields || []).map((openingHour, index) => (
                    <div key={index}>
                        <Row>
                            <Col xs={12} sm={4}>
                                <Field
                                    name={`${openingHour}.startTime`}
                                    id={`${dayField.day}-startTime-${index}`}
                                    placeholder={(<SafeHTMLMessage id='ui-calendar.settings.select_time'/>)}
                                    component={Timepicker}
                                    disabled={disableFields}
                                    passThroughValue="now"
                                />
                            </Col>
                            <Col xs={12} sm={4}>
                                <Field
                                    name={`${openingHour}.endTime`}
                                    id={`${dayField.day}-endHour-${index}`}
                                    placeholder={(<SafeHTMLMessage id='ui-calendar.settings.select_time'/>)}
                                    component={Timepicker}
                                    disabled={disableFields}
                                    passThroughValue="now"
                                />
                            </Col>
                            <Col xs={12} sm={2}>
                                <Button fullWidth name="add" onClick={() => fields.insert(index + 1, newOpeningHour)}
                                        disabled={disableFields}>
                                    <SafeHTMLMessage id='ui-calendar.settings.add'/>
                                </Button>
                            </Col>
                            <Col xs={12} sm={2}>
                                <Button fullWidth name="remove" buttonStyle="danger" disabled={fields.length === 1}
                                        onClick={() => fields.remove(index)}>
                                    <SafeHTMLMessage id='ui-calendar.settings.remove'/>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        );
    }
}

export default OpeningHourComponent;
