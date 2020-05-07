import React from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  List
} from '@folio/stripes/components';

import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line


class ServicePointSelector extends React.Component {
  static propTypes = {
    servicePoints: PropTypes.object.isRequired,
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
      <li data-test-service-point>
        <div
          className="CircleDiv"
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
    const isEmptyMessage = 'No items to show';

    return (
      <div data-test-service-point-selector>
        <List
          items={items}
          itemFormatter={itemFormatter}
          isEmptyMessage={isEmptyMessage}
        />
      </div>
    );
  }
}

export default ServicePointSelector;
