import React from 'react';
import {Headline} from "../../../stripes-components";
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Button from "@folio/stripes-components/lib/Button/Button";


class BigCalendarHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="big-calendar-header">
                <Row>
                    <Col xs={6}>
                        <Headline>
                            {this.props.stripes.intl.formatMessage({id: 'ui-calendar.regularLibraryHoursCalendar'})}
                        </Headline>
                    </Col>
                    <Col xs={6} className="new-period-buttons">
                        <Button>
                            {this.props.stripes.intl.formatMessage({id: 'ui-calendar.selectTemplate'})}
                        </Button>
                        <Button>
                            {this.props.stripes.intl.formatMessage({id: 'ui-calendar.copy'})}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default BigCalendarHeader;