import React from 'react';
import {Headline} from "../../../stripes-components";
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';


class BigCalendarHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs={3}>
                        <Headline>
                            Regular Library Hours:
                        </Headline>
                    </Col>
                    <Col xs={3}>
                    </Col>
                    <Col xs={3}>
                        <Headline>
                            Select Template
                        </Headline>
                    </Col>
                    <Col xs={3}>
                        <Headline>
                            Copy Previous
                        </Headline>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default BigCalendarHeader;