import React from 'react';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Headline from "@folio/stripes-components/lib/Headline/Headline";
import Button from "@folio/stripes-components/lib/Button/Button";
import PropTypes from 'prop-types';
import IconButton from "@folio/stripes-components/lib/IconButton/IconButton";

class FromHeader extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
    };

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={3}>
                        <IconButton
                            onClick={this.props.onClose}
                            icon="closeX"
                            size="medium"
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
                <hr/>
            </div>
        );

    }
}

export default FromHeader;
