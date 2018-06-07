import {cloneDeep} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Paneset from "../../stripes-components/lib/Paneset/Paneset";
import Pane from "../../stripes-components/lib/Pane/Pane";
import Checkbox from "../../stripes-components/lib/Checkbox";

class CloneSettings extends React.Component {
    static propTypes = {
        stripes: PropTypes.shape({
            connect: PropTypes.func.isRequired,
            intl: PropTypes.object.isRequired,
        }).isRequired,
        initialValues: PropTypes.object,
    };

    constructor(props) {
        super();
        this.state = {}
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


    render() {

        return(
           <div>
               lofaszs
               lofaszs
               lofaszs
               lofaszs
               lofaszs
           </div>

        )

    }
}

export default CloneSettings;
