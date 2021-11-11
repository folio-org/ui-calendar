import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  List
} from '@folio/stripes/components';

import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line


class ServicePointSelector extends React.Component {
  static propTypes = {
    servicePoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleServicePointChange: PropTypes.func.isRequired,
  };

  onToggleSelect = (event) => {
    event.selected = !event.selected;
    this.handleServicePointChange(event);
  };

  handleServicePointChange = (sp) => {
    this.props.handleServicePointChange(sp);
  };

  render() {
    const items = this.props.servicePoints;
    const itemFormatter = (item) => (
      <li data-test-service-point key={item.id}>
        <div
          className="circleDiv"
          style={{ background: item.color }}
        />
        <Checkbox
          id={item.id}
          label={item.name}
          checked={item.selected}
          onChange={() => this.onToggleSelect(item)}
          fullWidth
        />
      </li>
    );

    return (
      <div data-test-service-point-selector>
        <List
          items={items}
          itemFormatter={itemFormatter}
          isEmptyMessage={<FormattedMessage id="ui-calendar.noServicePoints" />}
        />
      </div>
    );
  }
}

export default ServicePointSelector;
