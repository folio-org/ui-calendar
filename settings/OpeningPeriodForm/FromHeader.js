import React from 'react';
import Icon from "@folio/stripes-components/lib/Icon/Icon";
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Headline from "@folio/stripes-components/lib/Headline/Headline";
import Button from "@folio/stripes-components/lib/Button/Button";

class FromHeader extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={3}>
                        <Icon
                            icon="closeX"
                            size="large"
                            iconClassName="closeIcon"
                        />
                    </Col>
                    <Col sm={6}>
                        <Headline size="large" margin="medium" tag="h3">
                            New: Regular Library Hours Validity Period
                        </Headline>
                    </Col>
                    <Col sm={3}>
                        <Button buttonStyle="danger">Delete</Button>
                        <Button buttonStyle="default">Save</Button>
                        <Button buttonStyle="primary">Saves as Template</Button>
                    </Col>
                </Row>
            </div>
        );

    }
}

export default FromHeader;
