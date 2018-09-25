import React from 'react';
import PropTypes from 'prop-types';
import List from '@folio/stripes-components/lib/List';
import Checkbox from '../../../stripes-components/lib/Checkbox';
import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line


class ServicePointSelector extends React.Component {
    static propTypes = {
      servicePoints: PropTypes.object.isRequired,
      handleServicePointChange: PropTypes.func.isRequired,
    };

    constructor() {
      super();
      this.handleServicePointChange = this.handleServicePointChange.bind(this);
      this.onToggleSelect = this.onToggleSelect.bind(this);
    }

    onToggleSelect(event) {
      event.selected = !event.selected;
      this.handleServicePointChange(event);
    }

    handleServicePointChange(sp) {
      this.props.handleServicePointChange(sp);
    }

    render() {
      const items = this.props.servicePoints;
      const itemFormatter = (item) => (
        <li>
          <div className="CircleDiv" style={{ background: item.color }} />
          <Checkbox
            id={item.id}
            label={item.name}
            onChange={() => this.onToggleSelect(item)}
            fullWidth
          />
        </li>
      );
      const isEmptyMessage = 'No items to show';

      return (
        <List
          items={items}
          itemFormatter={itemFormatter}
          isEmptyMessage={isEmptyMessage}
        />
      );
    }
}

export default ServicePointSelector;
