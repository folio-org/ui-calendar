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
            <div>
                <Row>
                    <Col xs={3}>
                        <Headline>
                            Regular Library Hours:
                        </Headline>
                    </Col>
                    <Col xs={7}>
                    </Col>
                    <Col xs={2}>
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