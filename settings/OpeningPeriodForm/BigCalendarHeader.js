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
                            Regular Library Hours:
                        </Headline>
                    </Col>
                    <Col xs={6} className="new-period-buttons">
                        <Button>
                            Select Template
                        </Button>
                        <Button>
                            Copy Previous
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default BigCalendarHeader;