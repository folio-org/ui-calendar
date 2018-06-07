import {sortBy} from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import {FormattedMessage} from 'react-intl';
import ServicePointDetails from './ServicePointDetails';
import List from "../../stripes-components/lib/List/List";
import ServicePointForm from "../../ui-organization/settings/ServicePoints/ServicePointForm";

class LibraryHours extends React.Component {

    static propTypes = {
        label: PropTypes.string.isRequired,
        resources: PropTypes.shape({
            entries: PropTypes.shape({
                records: PropTypes.arrayOf(PropTypes.object),
            }),
        }).isRequired,
        mutator: PropTypes.shape({
            entries: PropTypes.shape({
                GET: PropTypes.func,
            }),
        }).isRequired,
        stripes: PropTypes.shape({
            intl: PropTypes.object.isRequired,
        }),
    };

    static manifest = Object.freeze({
        entries: {
            type: 'okapi',
            records: 'servicepoints',
            path: 'service-points',
        },
    });

    constructor() {
        super();
    }

    translate(id) {
        return this.props.stripes.intl.formatMessage({
            id: `ui-organization.settings.servicePoints.${id}`
        });
    }

    render() {

        return (
            <EntryManager
                {...this.props}
                parentMutator={this.props.mutator}
                entryList={sortBy((this.props.resources.entries || {}).records || [], ['name'])}
                detailComponent={ServicePointDetails}
                entryFormComponent={() => ({})}
                paneTitle={this.props.label}
                entryLabel={this.props.label}
                nameKey="name"
                permissions={{
                    put: 'settings.calendar.disabled',
                    post: 'settings.calendar.disabled',
                    delete: 'settings.calendar.disabled',
                }}
            />
        );
    }
}

export default LibraryHours;
