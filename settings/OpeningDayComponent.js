import React from 'react';
import PropTypes from 'prop-types';
import {Field, FieldArray} from 'redux-form';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import TextField from '@folio/stripes-components/lib/TextField';
import OpeningHourComponent from './OpeningHourComponent';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

class OpeningDayComponent extends React.Component {
    static propTypes = {
        fields: PropTypes.object
    };

    render() {
        const fields = this.props.fields.name;
        console.log(this.props);
        return (
            <div>
                {fields.map((openingDay, index) => (
                    <div key={index}>
                        <Row>
                            <Col xs={12} sm={1}>
                                <SafeHTMLMessage id={`ui-calendar.${openingDay.day}`}/>
                                <Field
                                    label=""
                                    name={`${openingDay}`}
                                    component={TextField}
                                    disabled="true"
                                    hidden
                                />
                            </Col>
                            <Col xs={12} sm={1}>
                                <Field
                                    label={(<SafeHTMLMessage id='ui-calendar.settings.opening'/>)}
                                    name={`${openingDay}`}
                                    type="checkbox"
                                    id={`open-${index}`}
                                    component={Checkbox}
                                />
                            </Col>
                            <Col xs={12} sm={1}>
                                <Field
                                    label={(<SafeHTMLMessage id='ui-calendar.settings.allDay'/>)}
                                    name={`${openingDay}`}
                                    type="checkbox"
                                    id={`allDay-${index}`}
                                    component={Checkbox}
                                    disabled={!openingDay.open}
                                />
                            </Col>
                            <Col xs={12} sm={9}>
                                <FieldArray name={`${openingDay}.openingHour`} component={OpeningHourComponent}
                                            dayField={openingDay}/>
                            </Col>
                        </Row>
                        <hr/>
                    </div>
                ))}
            </div>
        );
    }
}

export default OpeningDayComponent;
