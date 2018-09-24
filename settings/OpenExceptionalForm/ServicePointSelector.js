import React from 'react';
import PropTypes from 'prop-types';
import List from '@folio/stripes-components/lib/List';
import Checkbox from '../../../stripes-components/lib/Checkbox';


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
      // const entriNames = [];
      // for (let i = 0; i < this.props.servicePoints.length; i++) {
      //   entriNames[i] = this.props.servicePoints[i];
      // }
      const items = this.props.servicePoints;
      const itemFormatter = (item) => (

        <li>
          <Checkbox
            id={item.id}
            label={item.name}
            onChange={() => this.onToggleSelect(item)}
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
