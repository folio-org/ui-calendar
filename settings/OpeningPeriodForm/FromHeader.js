import React from 'react';
import {Row, Col} from '@folio/stripes-components/lib/LayoutGrid';
import Headline from "@folio/stripes-components/lib/Headline/Headline";
import Button from "@folio/stripes-components/lib/Button/Button";
import PropTypes from 'prop-types';
import IconButton from "@folio/stripes-components/lib/IconButton/IconButton";
import { FormattedMessage } from 'react-intl';

class FromHeader extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        handleDelete: PropTypes.func
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
                            <FormattedMessage id="ui-calendar.regularLibraryValidityPeriod" />
                        </Headline>
                    </Col>
                    <Col sm={3} className="new-period-buttons">

                        <Button onClick={()=>{this.props.handleDelete();}} buttonStyle="danger" >{this.props.stripes.intl.formatMessage({id: 'ui-calendar.deleteButton'})}</Button>
                        <Button type="submit" buttonStyle="default">{this.props.stripes.intl.formatMessage({id: 'ui-calendar.saveButton'})}</Button>
                        <Button disabled buttonStyle="primary">{this.props.stripes.intl.formatMessage({id: 'ui-calendar.savesAsTemplate'})}</Button>

                    </Col>
                </Row>
                <hr/>
            </div>
        );

    }
}

export default FromHeader;
